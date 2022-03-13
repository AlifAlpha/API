const Nomination = require("../models/nomination");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const config = require("./config/config");

const OAuth2_client = new OAuth2(config.clientId, config.clientSecret);
OAuth2_client.setCredentials({
  refresh_token: config.refreshToken,
  forceRefreshOnFailure: true,
});

function sendEmail(name, recipients) {
  const accessToken = OAuth2_client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: config.user,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      refreshToken: config.refreshToken,
      accessToken: accessToken,
      expires: 1484314697598,
    },
  });
  const mailOption = {
    from: `<${config.user}>`,
    to: recipients,
    subject: "Nomination - ICESCO Youth Year",
    html: getHtmlMessage(name),
    attachments: [
      {
        filename: "icesco.png",
        path: __dirname + "/assets/picto.png",
        cid: "logo1", //my mistake was putting "cid:logo@cid" here!
      },
      {
        filename: "icesco.png",
        path: __dirname + "/assets/picto2.png",
        cid: "logo2", //my mistake was putting "cid:logo@cid" here!
      },
      name.certif
        ? {
            filename: "certificate.pdf",
            content: name.certif.base64.split(",")[1],
            encoding: "base64",
          }
        : null,
      name.idetite
        ? {
            filename: "ID.pdf",
            content: name.idetite.base64.split(",")[1],
            encoding: "base64",
          }
        : null,
      name.cv
        ? {
            filename: "cv.pdf",
            content: name.cv.base64.split(",")[1],
            encoding: "base64",
          }
        : null,
      name.exp
        ? {
            filename: "experiences.pdf",
            content: name.exp.base64.split(",")[1],
            encoding: "base64",
          }
        : null,
    ],
  };

  transport.sendMail(mailOption, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("200", result);
    }
    transport.close();
  });
}

function getHtmlMessage({
  firstname,
  lastname,
  birth,
  nationality,
  residence,
  sex,
  phone,
  email,
  certificates,
  reason,
  experience,
  currentField,
  currentWork,
  employer,
  workAddress,
  employerPhone,
  employerWebsite,
  employerEmail,
}) {
  return `
  <div>
    <div
      style="
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 80px;
      "
    >
      <img src="cid:logo1" />
      <img src="cid:logo2" />
    </div>
    <p> 
      Dear team, <br/>
Please find attached the documents related to Mr/Mrs <b>${
    lastname + " " + firstname
  }</b> ICESCO Youth Year nomination<br/>

Kind regards,
      
    </p>
    <br/>
    Kind regards
  </div>
`;
}

exports.createNomination = async (req, res) => {
  console.log(req.body);
  const nomination = await new Nomination(req.body);
  await nomination.save();
  sendEmail(req.body, "a.chegdali@icesco.org"); /*, it@icesco.org");*/
  res.status(200).json({ message: "Nomination form is submitted" });
};

exports.getNomination = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["createdAt" , "DESC"]';
  let filter = req.query.filter || "{}";
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);
  filter = JSON.parse(filter);
  if (filter.name) {
    filter.name = { $regex: ".*" + filter.name + ".*" };
  }
  // ?
  if (filter.start) {
    let dateStr = new Date(filter.start);
    let nextDate = new Date(filter.start);
    nextDate.setDate(nextDate.getDate() + 1);
    console.log(dateStr, nextDate);
    filter.start = {
      $gte: new Date(dateStr),
      $lte: new Date(nextDate),
    };
  }
  if (filter.id) {
    filter._id = {
      $in: [...filter.id.map((c) => mongoose.Types.ObjectId(c))],
    };
    delete filter.id;
  }
  console.log(filter);

  Nomination.countDocuments(filter, function (err, c) {
    count = c;
    // console.log("hello", c);
    let map = new Map([sort]);
    Nomination.find(filter)
      .sort(Object.fromEntries(map))
      .skip(range[0])
      .limit(range[1] + 1 - range[0])
      .then((data) => {
        let formatData = [];
        console.log(data.length, range);
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set(
          "Content-Range",
          `Nomination ${range[0]}-${range[1] + 1}/${count}`
        );
        res.status(200).json(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNominationById = (req, res, next, id) => {
  Nomination.findById(id).exec((err, data) => {
    if (err) {
      return res.status(200).json({ error: "Nomination not found" });
    }
    req.nomination = data;

    next();
  });
};

exports.getOneNomination = (req, res) => {
  nomination = req.nomination;
  if (nomination) {
    res.set("Content-Range", `nomination 0-1/1`);
    res.json(nomination.transform());
  } else
    res.status(200).json({
      id: "",
      message: "nomination not found",
    });
};

exports.updateNomination = (req, res) => {
  let nomination = req.nomination;
  nomination = _.extend(nomination, req.body);
  nomination.save((err, nomination) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    return res.status(200).json(nomination.transform());
  });
};

exports.deleteNomination = (req, res) => {
  let nomination = req.nomination;

  nomination.remove((err, nomination) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json({
      message: "nomination deleted successfully",
    });
  });
};

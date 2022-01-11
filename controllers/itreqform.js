const Itreqform = require("../models/itreqform");
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
    subject: "IT Request Form",
    html: getHtmlMessage(name),
    attachments: [
      {
        filename: "icesco.png",
        path: __dirname + "/assets/picto.png",
        cid: "logo1", //my mistake was putting "cid:logo@cid" here!
      },
      {
        filename: "icesco.png",
        path: __dirname + "/assets/ecriture.png",
        cid: "logo2", //my mistake was putting "cid:logo@cid" here!
      },
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
  eventName,
  eventCoordinator,
  phone,
  start,
  time,
  location,
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
      Dear team,<br />
      Please find below the infos regarding  our IT request .
      
    </p>
   
    Event name : <b>${eventName}</b><br />
    Coordinator : <b>${eventCoordinator}</b><br />
    Phone: <b>${phone}</b><br/>
    Start:<b> ${start}</b><br/>
    Time:<b> ${time}</b><br/>
    Location:<b> ${location}</b><br/>
    
   
    Kind regards
  </div>
`;
}

exports.createItreqform = async (req, res) => {
  //   const leaveExists = await Leaves.findOne({
  //     name: req.body.name,
  //     start: req.body.start,
  //     end: req.body.end,
  //   });
  //   if (leaveExists) {
  //     return res.status(403).json({
  //       error: "Leave already exists",
  //     });
  //   }
  console.log(req.body);
  const itreqform = await new Itreqform(req.body);
  await itreqform.save();
  sendEmail(req.body, "chegdali.amine@gmail.com , it@icesco.org");
  res.status(200).json({ message: "IT request form is submitted" });
};
exports.getItreqform = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["id" , "ASC"]';
  let filter = req.query.filter || "{}";
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);
  filter = JSON.parse(filter);
  if (filter.name) {
    filter.name = { $regex: ".*" + filter.name + ".*" };
  }
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

  Itreqform.countDocuments(filter, function (err, c) {
    count = c;
    // console.log("hello", c);
    let map = new Map([sort]);
    Itreqform.find(filter)
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
          `Itreqform ${range[0]}-${range[1] + 1}/${count}`
        );
        res.status(200).json(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
exports.getItreqformById = (req, res, next, id) => {
  Itreqform.findById(id).exec((err, data) => {
    if (err) {
      return res.status(200).json({ error: "Itreqform not found" });
    }
    req.itreqform = data;

    next();
  });
};
exports.getOneItreqform = (req, res) => {
  itreqform = req.itreqform;
  if (itreqform) {
    res.set("Content-Range", `itreqform 0-1/1`);
    res.json(itreqform.transform());
  } else
    res.status(200).json({
      id: "",
      message: "itreqform not found",
    });
};
exports.updateItreqform = (req, res) => {
  let itreqform = req.itreqform;
  itreqform = _.extend(itreqform, req.body);
  itreqform.save((err, itreqform) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    return res.status(200).json(itreqform.transform());
  });
};
exports.deleteItreqform = (req, res) => {
  let itreqform = req.itreqform;

  itreqform.remove((err, itreqform) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json({
      message: "itreqform deleted successfully",
    });
  });
};

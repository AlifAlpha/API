const Activity = require("../models/activity");const _ = require("lodash");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const config = require("./config/config");
const OAuth2_client = new OAuth2(config.clientId, config.clientSecret);
OAuth2_client.setCredentials({
  refresh_token: config.refreshToken,
  forceRefreshOnFailure: true,
});

function sendEmail(name, recipient, conceptnote) {
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
    to: recipient,
    subject: "DG Appointment Request",
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
      {
        filename: "CV_DG_Appointments.pdf",
        content: conceptnote.split(",")[1],
        encoding: "base64",
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
  startMeet,
  name,
  title,
  dateDurStart,
  dateDurEnd,
  purpose,
  appType,
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
      Please find below the infos regarding  our Appointment request to his excellency.
    </p>
   
    start meeting: <b>${startMeet}</b><br />
    Name: <b>${name}</b><br/>
    Title:<b> ${title}</b><br/>
    Purpose date:<b> ${purpose}</b><br/>
    <h6>Duration</h6>
    <b>From : </b> ${dateDurStart}<br/>
    <b>To :</b> ${dateDurEnd}<br/>
    App type:<b> ${appType}</b><br/>
   
    Kind regards
  </div>
`;
}
exports.createActivity = async (req, res) => {
  console.log(req.body);
  const activity = await new Activity(req.body);
  await activity.save();
  console.log(req.body);
  res.status(200).json({ message: "Your request is submitted" });
  //   sendEmail(
  //     req.body,
  //     "chegdali.amine@gmail.com , cabdg@icesco.org",
  //     req.body.attechedcv.base64
  //   );
};

exports.getActivities = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["id","DESC"]';
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);
  Activity.countDocuments(function (err, c) {
    count = c;
    let map = new Map([sort]);
    Activity.find()
      .sort(Object.fromEntries(map))
      .then((data) => {
        let formatData = [];
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set(
          "content-Range",
          `Activity ${range[0]}-${range[1] + 1}/${count}`
        );
        res.status(200).json(formatData);
      })
      .catch((err) => console.log(err));
  });
};

exports.getActivityById = (req, res, next, id) => {
  Activity.findById(id).exec((err, data) => {
    if (err)
      return res.status(200).json({ id: "", message: "Activity not found" });
    req.activity = data;
    next();
  });
};

exports.getOneActivity = (req, res) => {
  let activity = req.activity;
  if (activity) {
    res.json(activity.transform());
  } else {
    res.status(200).json({ id: "", message: "activity not found" });
  }
};

exports.updateAcivity = (req, res) => {
  let activity = req.activity;
  activity = _.extend(activity, req.body);
  activity.save((err, activity) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    res.status(200).json(activity.transform());
  });
};

exports.deleteAcivity = (req, res) => {
  let activity = req.activity;
  activity.remove((err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  });
};

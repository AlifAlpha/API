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
function sendEmail(name, recipient) {
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
    subject: `${name.name} - ICESCO’s upcoming Programmes & Activities`,
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
     
      // name.workingPaper.base64.length != 0 ?
      {
        // path: name.workingPaper.base64,
        filename: "Working paper.pdf",
        content: name.workingPaper.base64.split(",")[1],
        encoding: "base64",
      },
      //  : {
      //   filename: "Working paper.txt",
      //   content: "No file uploaded",
      //   encoding: "text/plain",
      // },
      // name.agenda.base64.length != 0 ?
      {
        // path: name.agenda.base64,
        filename: "Agenda.pdf",
        content: name.agenda.base64.split(",")[1],
        encoding: "base64",
      } ,
      // : {
      //   filename: "Agenda.txt",
      //   content: "No file uploaded",
      //   encoding: "text/plain",
      // },
      // name.programme.base64.length != 0 ?
      {
        // path: name.program.base64,
        filename: "Program.pdf",

        content: name.programme.base64.split(",")[1],
        encoding: "base64",
      } 
      // : {
      //   filename: "Program.txt",
      //   content: "No file uploaded",
      //   encoding: "text/plain",
      // },
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
  name,
  date,
  lieu,
  organisation,
  organizer,
  language,
  translation,
  actionRequired,
  contact,
  email,
  phone,
  zoomLink,
  meetingpassword,
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
      Dear all, <br/><br/>
Please find attached the documents related to : <b>${name} event on the ${date} in ${lieu}</b> <br/>
  Format/Nom de l’Activité/التنظيم : <br/> <b> ${organisation} </b><br/>
  Organizer: <b> ${organizer} </b><br/>
  Language: <b> ${language} </b><br/>
  Translation: <b> ${translation} </b><br/>
  Action required: <br><b> ${actionRequired} </b><br/>
  Contact: <b> ${contact} </b><br/>
  Email: <b> ${email} </b><br/>
  Phone: <b> ${phone} </b><br/>
  ZoomLink: <b> ${zoomLink} </b><br/>
  Meeting password: <b> ${meetingpassword} </b><br/>
  </p>
    <br/>
    Kind regards <br/><br/>

    

  </div>
`;
}
exports.createActivity = async (req, res) => {
  console.log(req.body);
  const activity = await new Activity(req.body);
  await activity.save();
  console.log(req.body);
  res.status(200).json({ message: "Your request is submitted" });
  sendEmail(req.body, "a.chegdali@icesco.org");
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

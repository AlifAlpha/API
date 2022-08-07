const Activity = require("../models/activity");const _ = require("lodash");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const config = require("./config/config");
const pdf = require ("html-pdf-node");
const fs = require ("fs");
const path = require("path");

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
      } ,
      {   // use URL as an attachment
        filename: 'Information Form.pdf',
        path: path.join(__dirname , "./assets/output.pdf"),
        contentType :  'application.pdf',
    },
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
Please find attached the documents related to : <b>${name} event </b> on the <b> ${date} </b> in <b> ${lieu}</b> <br/><br/><br/>
  Format / Organisation / التنظيم : <br/> <b> ${organisation} </b><br/>
  Organizer / Parties organisatrices / الجهات المنظمة: <br/><b> ${organizer} </b><br/>
  Languages / Langues de travail / لغات العمل: <br/> <b> ${language} </b><br/>
  Translation / Interprétariat / الترجمة الفورية:<br/> <b> ${translation} </b><br/>
  Action required / Action requise de la commission / المطلوب من اللجنة: <br><b> ${actionRequired} </b><br/>
  ICESCO Contact / Partie de contact à l’ICESCO / جهة التواصل في الإيسيسكو: :<br/> <b> ${contact} </b><br/>
  Email / البريد الإلكتروني:<br/> <b> ${email} </b><br/>
  Telehone / الجوال:<br/> <b> ${phone} </b><br/>
  Zoom Link / Lien Zoom / رابط زووم:<br/> <b> ${zoomLink} </b><br/>
  Meeting password:<br/> <b> ${meetingpassword} </b><br/>
  </p>
    <br/>
    Kind regards <br/><br/>

    

  </div>
`;
}

const htmlToPdf = (data) => {
  // console.log(fs.readFileSync("controllers\\assets\\picto.png","base64"))
  let template = `
  <html lang="en">  
  <head>
    <title>Document</title>
    <style>
      body div.container {
        display: flex;
        align-items: center;
        flex-direction: column;
      }
      table {
        width: 70%;
        margin-top: 90px;
      }
      table,
      td,
      th {
        border: 1px solid black;
        border-collapse: collapse;
      }
      td {
        text-align: center;
        padding: 7px;
      }
      .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .right-img {
        height: 60px;
        margin-top: 20px;
      }
      th {
        padding: 3px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <img height="100px" src='https://cdn.discordapp.com/attachments/760591760468082761/1005910003540049950/picto.png'/>
      </div>
      <div>
        <div>
          <img class="right-img" height="60px" src='https://cdn.discordapp.com/attachments/760591760468082761/1005910003170947093/ecriture.png' />
        </div>
      </div>
    </div>
    <div class="container">
      <h3>title 1</h3>
      <h3>title 2</h3>
      <h3>title 3</h3>
      <table>
        <tr>
          <th>Activity Name - Nom de l’Activité | اسم النشاط</th>
        </tr>
        <tr>
          <td>${data.name}</td>
        </tr>
        <tr>
          <th>name\nom\اسم</th>
        </tr>
        <tr>
          <td>name\nom\اسم</td>
        </tr>
        <tr>
          <th>name\nom\اسم</th>
        </tr>
        <tr>
          <td>name\nom\اسم</td>
        </tr>
        <tr>
          <th>name\nom\اسم</th>
        </tr>
        <tr>
          <td>name\nom\اسم</td>
        </tr>
        <tr>
          <th>name\nom\اسم</th>
        </tr>
        <tr>
          <td>name\nom\اسم</td>
        </tr>
        <tr>
          <th>name\nom\اسم</th>
        </tr>
        <tr>
          <td>name\nom\اسم</td>
        </tr>
        <tr>
          <th>name\nom\اسم</th>
        </tr>
        <tr>
          <td>name\nom\اسم</td>
        </tr>
        <tr>
          <th>name\nom\اسم</th>
        </tr>
        <tr>
          <td>name\nom\اسم</td>
        </tr>
      </table>
    </div>
  </body>
</html>

  `
  let options = {format: 'A4', path:"controllers\\assets\\output.pdf"}
  let file = {content : template}

  pdf.generatePdf(file, options).then(output => {
    console.log("PDF Buffer:-", output); 
    
  });

};
exports.createActivity = async (req, res) => {
  console.log(req.body);
  const activity = await new Activity(req.body);
  await activity.save();
  console.log(req.body);
  res.status(200).json({ message: "Your request is submitted" });
  htmlToPdf(req.body);
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



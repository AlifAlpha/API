const Ltips = require("../models/ltips");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const config = require("./config/config");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const OAuth2_client = new OAuth2(config.clientId, config.clientSecret);
OAuth2_client.setCredentials({
  refresh_token: config.refreshToken,
  forceRefreshOnFailure: true,
});

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

function sendEmail(name, recipients) {
  const mailOption = {
    from: `<${config.user}>`,
    to: recipients,
    subject: "Leadership Taining in Peace and Security - Online Application",
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
            filename: "CV.pdf",
            content: name.cv.base64.split(",")[1],
            encoding: "base64",
          }
        : null,
      name.exp
        ? {
            filename: "leadership.pdf",
            content: name.exp.base64.split(",")[1],
            encoding: "base64",
          }
        : null,
      name.recommand
        ? {
            filename: "additional doc.pdf",
            content: name.recommand.base64.split(",")[1],
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
  languages,
  reason,
  experience,
  leadershipcredentials,
  recommandName,
  recommandPhone,
  recommandEmail,
  recommandTitle,
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
      Dear team, <br/><br/>
Please find attached the documents related to Mr/Mrs <b>${
    lastname + " " + firstname
  }</b> ICESCO Leadership Taining in Peace and Scurity<br/>

  Name: <b> ${firstname + " " + lastname}  </b><br/>
  Birth day: <b> ${birth} </b><br/>
  Nationality: <b> ${nationality} </b><br/>
  Residence: <b> ${residence} </b><br/>
  Gender: <b> ${sex} </b><br/>
  Personal phone: <b> ${phone} </b><br/>
  Personal email: <b> ${email} </b><br/>
  Certificates: <b> ${certificates} </b><br/>
  languages: <b> ${languages} </b><br/>
  Personal email: <b> ${email} </b><br/>
  Candidacy objective: <b> ${reason} </b><br/>
  Experience: <b> ${experience} </b><br/><br/><br/>
  Leadership: <b> ${leadershipcredentials} </b><br/>
  recommander's Name: <b> ${recommandName} </b><br/>
  recommander's Title: <b> ${recommandTitle} </b><br/>
  recommander's Phone: <b> ${recommandPhone} </b><br/>
  recommander's Email: <b> ${recommandEmail} </b><br/>
  </p>
    <br/>
    Kind regards
  </div>
`;
}

function sendReplyEmail({ email }) {
  const mailReplyOption = {
    from: `<${config.user}>`,
    to: email,
    subject: "noreply:Nomination - ICESCO Youth Year",
    html: getHtmlReply(),
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
  transport.sendMail(mailReplyOption, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("200", result);
    }
    transport.close();
  });
}

function getHtmlReply() {
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
  
    This is an auto-generated response.<br/>
    Please do not reply to this email as it will not be received.<br/>
    Thank you for applying to ICESCO’s Leadership Training in Peace and Security. 
    We have received your application and will be processing it soon.<br/><br/>

    هذا جواب تلقائي، يرجى عدم الرد على هذا البريد الإلكتروني لأنه لن يتم استلامه.<br/>
    شكرًا على طلب الترشيح لبرنامج التدريب على القيادة من أجل السلام والأمن التابع للإيسيسكو. لقد تلقينا طلبكم وسنقوم بدراسته قريبًا.<br/><br/>
        
  
    Ceci est une réponse automatique, prière de ne pas répondre.<br/>
    Nous vous remercions pour votre intérêt pour la Formation en leadership pour la paix et la sécurité de l'ICESCO. 
    Nous avons bien reçu votre candidature et nous la traiterons prochainement.<br/><br/>


    </p>
    <br/>
    Kind regards,<br/>
    ICESCO
  </div>
`;
}

exports.createLtips = async (req, res) => {
  console.log(req.body);
  const ltips = await new Ltips(req.body);
  await ltips.save();

  sendEmail(req.body, "a.chegdali@icesco.org;ltips@icesco.org");
  // sendReplyEmail(req.body);

  res.status(200).json({ message: "The form has been submitted" });
};

exports.getLtips = (req, res) => {
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

  Ltips.countDocuments(filter, function (err, c) {
    count = c;
    // console.log("hello", c);
    let map = new Map([sort]);
    Ltips.find(filter)
      .sort(Object.fromEntries(map))
      .skip(range[0])
      .limit(range[1] + 1 - range[0])
      .then((data) => {
        let formatData = [];
        console.log(data.length, range);
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set("Content-Range", `Ltips ${range[0]}-${range[1] + 1}/${count}`);
        res.status(200).json(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getLtipsById = (req, res, next, id) => {
  Ltips.findById(id).exec((err, data) => {
    if (err) {
      return res.status(200).json({ error: "LTIPS not found" });
    }
    req.ltips = data;

    next();
  });
};

exports.getOneLtips = (req, res) => {
  ltips = req.ltips;
  if (ltips) {
    res.set("Content-Range", `ltips 0-1/1`);
    res.json(ltips.transform());
  } else
    res.status(200).json({
      id: "",
      message: "ltips not found",
    });
};

exports.updateLtips = (req, res) => {
  let ltips = req.ltips;
  ltips = _.extend(ltips, req.body);
  ltips.save((err, ltips) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    return res.status(200).json(ltips.transform());
  });
};

exports.deleteLtips = (req, res) => {
  let ltips = req.ltips;

  ltips.remove((err, ltips) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json({
      message: "ltips deleted successfully",
    });
  });
};

/* nomination pdf generater

// const{firstname,
//   lastname,
//   birth,
//   nationality,
//   residence,
//   sex,
//   phone,
//   email,
//   certificates,
//   reason,
//   experience,
//   currentField,
//   currentWork,
//   employer,
//   workAddress,
//   employerPhone,
//   employerWebsite,
//   employerEmail}=req.body

//   const doc = new PDFDocument();

//   doc.image("controllers/assets/picto2.png", 50, 15, { width: 50 });
//   doc.image("controllers/assets/picto.png", 500, 8, { width: 50 });
//   const customFont = fs.readFileSync(`controllers/pdf/Amiri-Regular.ttf`);
// doc.registerFont(`Amiri-Regular`, customFont);
//   doc
//     .fontSize(15)
//     .font("Amiri-Regular")
//     .fillColor("#008080")
//     .text("Nomination ICESCO Youth Year  للشباب الإيسيسكو عام ترشيح ", { align: "center" });
//     // doc.text("مرحبا كيف حالكTest", {features: ['rtla']})

//   doc
//     .fontSize(16)
//     .font("Times-Bold")
//     .fillColor("#7C9597")
//     .text("Personal information", 20, 100);
//   doc
//     .fontSize(16)
//     .font("Amiri-Regular")
//     .fillColor("#7C9597")
//     .text("المعلومات الشخصية", 430, 90, {features: ['rtla']});

//   doc
//     .fillColor("#000000")
//     .fontSize(14)
//     .font("Amiri-Regular")
//     .text(
//       `First name : ${!firstname ? "" : firstname}`,
//       20,
//       120
//     );
//   doc
//     .fillColor("#000000")
//     .fontSize(14)
//     .font("Amiri-Regular")
//     .text(
//       `الاسم`,
//       550,
//       120
//     );


  // doc.text(`Event/ project name : ${!eventName ? "" : eventName}`, 20, 140);
  // doc.text(`Implementation location : ${!location ? "" : location}`, 20, 160);
  // doc
  //   .text(`Event Date : ${!eventDate ? "" : eventDate}`, 20, 180)
  //   .moveDown(0.5);
  // doc
  //   .fontSize(16)
  //   .font("Times-Bold")
  //   .fillColor("#7C9597")
  //   .text("EVENT / PROJECT DETAILS", 20, 220);
  // doc
  //   .fillColor("#000000")
  //   .fontSize(14)
  //   .font("Helvetica")
  //   .text(`The Initiative is : ${!initiativeIs ? "" : initiativeIs}`, 20, 240);
  // doc.text(`Initiative frequency: ${!ferequincy ? "" : ferequincy}`, 20, 260);
  // doc.text(
  //   `Member state : ${!stakeHoldersMember ? "" : stakeHoldersMember}`,
  //   20,
  //   280
  // );
  // doc.text(
  //   `Non member state : ${
  //     !stakeHoldersNoMember ? "" : stakeHoldersNoMember
  //   }`,
  //   20,
  //   300
  // );
  // doc.text(
  //   `Partner : ${
  //     !stakeHolderspartner ? "" : stakeHolderspartner
  //   }`,
  //   20,
  //   320
  // );
  // doc.text(
  //   `The Initiative requires : ${!initiativeNeeds ? "" : initiativeNeeds}`,
  //   20,
  //   340
  // );

  // doc
  //   .fontSize(16)
  //   .font("Times-Bold")
  //   .fillColor("#7C9597")
  //   .text("DG PARTICIPATION INFORMATION", 20, 380);
  // doc
  //   .fillColor("#000000")
  //   .fontSize(14)
  //   .font("Helvetica")
  //   .text(
  //     `DG participation : ${!dgParticipation ? "" : dgParticipation}`,
  //     20,
  //     400
  //   );
  // doc.text(`Speech Topic : ${!speechTopic ? "" : speechTopic} `, 20, 420);
  // doc.text(`Key Points : ${!speechPoints ? "" : speechPoints}`, 20, 440);
  // doc.text(
  //   `Speech Duration : ${!speechDuration ? "" : speechDuration}`,
  //   20,
  //   460
  // );
  // doc.text(`Speech Date : ${!speechDate ? "" : speechDate}`, 20, 480);
  // doc.text(`Participation Level : ${!eventAttended ? "" : eventAttended}`, 20, 500);
  // doc.text(
  //   `Partnership : ${!eventPartnership ? "" : eventPartnership}`,
  //   20,
  //   520
  // );
  // doc.text(
  //   `State member engagement : ${!eventStateMember ? "" : eventStateMember}`,
  //   20,
  //   540
  // );

  // doc
  //   .fontSize(16)
  //   .font("Times-Bold")
  //   .fillColor("#7C9597")
  //   .text("FINANCIAL COVERAGE BY STAKEHOLDERS", 20, 580);
  // doc
  //   .fillColor("#000000")
  //   .fontSize(14)
  //   .font("Helvetica")
  //   .text(`Coverage For : ${!coverageFor ? "" : coverageFor}`, 20, 600);
  //   doc.text(`People covered : ${!numCoverage ? "" : numCoverage}`, 20, 620);
  // doc.text(
  //   `Initiative impact on ICESCO: ${!inpactInternal ? "" : inpactInternal}`,
  //   20,
  //   640
  // );
  // doc.text(
  //   `Internal Support required    : ${!internalSupport ? "" : internalSupport} `,
  //   20,
  //   660
  // );

  // doc.text(
  //   `Suppliers for : ${
  //     !internalSupportNeededSup ? "" : internalSupportNeededSup
  //   }`,
  //   20,
  //   680
  // );
  // doc.text(
  //   `Sponsors for : ${
  //     !internalSupportNeededSpo ? "" : internalSupportNeededSpo
  //   }`,
  //   20,
  //   700
  // );
  // // doc
  // //   .fontSize(14)
  // //   .font("Times-Bold")
  // //   .fillColor("#000")
  // //   .text("DG directions", { align: "right" });

  // doc.pipe(fs.createWriteStream("controllers/pdf/nomination.pdf")); // write to PDF
  // doc.end();
*/

const Intnote = require("../models/internalNote");
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

function sendEmail(name, recipient, invitation, conceptnote, attendees) {
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
    subject: "DG internal note Request",
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
        filename: "Event Concept Note.pdf",
        content: conceptnote.split(",")[1],
        encoding: "base64",
      },
      {
        filename: "Attendees / Participant.pdf",
        content: attendees.split(",")[1],
        encoding: "base64",
      },
      {
        filename: "invitation.pdf",
        content: invitation.split(",")[1],
        encoding: "base64",
      },
      {
        filename: "internalNote.pdf",
        path: __dirname + "/pdf/output.pdf",
        contentType: "application/pdf",
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
  departmentName,
  eventName,
  location,
  eventDate,
  initiativeIs,
  ferequincy,
  stakeHoldersMember,
  stakeHoldersNoMember,
  stakeHolderspartner,
  initiativeNeeds,
  dgParticipation,
  speechTopic,
  speechPoints,
  speechDuration,
  speechDate,
  eventAttended,
  eventPartnership,
  eventStateMember,
  numCoverage,
  coverageFor,
  inpactInternal,
  internalSupport,
  internalSupportNeededSup,
  internalSupportNeededSpo,
  referencing,
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
      Please find below the infos regarding  our internal note to his excellency.
    </p>
   
    Department Name: <b>${departmentName}</b><br />
    Event Name: <b>${eventName}</b><br/>
    Location:<b> ${location}</b><br/>
    Event Date:<b> ${eventDate}</b><br/>
    InitiativeIs: <b>${initiativeIs}</b><br/>
    Event Ferequency:<b> ${ferequincy}</b><br/>
    Stake Holders Member:<b>${stakeHoldersMember}</b><br/>
    Stake Holders No Member:<b> ${stakeHoldersNoMember}</b><br/>
    stakeHolderspartner: <b>${stakeHolderspartner}</b><br/>
    Initiative Needs: <b>${initiativeNeeds}</b><br/>
    DG Participation: <b>${dgParticipation}</b><br/>
    Speech Topic: <b>${speechTopic}</b><br/>
    Speech Points: <b>${speechPoints}</b><br/>
    Speech Duration: <b>${speechDuration}</b><br/>
    Speech Date: <b>${speechDate}</b><br/>
    Event Attended: <b>${eventAttended}</b><br/>
    Event Partnership: <b>${eventPartnership}</b><br/>
    Event State Member: <b>${eventStateMember}</b><br/>
    Num Coverage: <b>${numCoverage}</b><br/>
    Coverage For: <b>${coverageFor}</b><br/>
    Inpact Internal: <b>${inpactInternal}</b><br/>
    Internal Support: <b>${internalSupport}</b><br/>
    External Support Needed (Supplier): <b>${internalSupportNeededSup}</b><br/>
    External Support Needed (Sponsor): <b>${internalSupportNeededSpo}</b><br/>

    Kind regards<br/>
    ${eventName} Team,
  </div>
`;
}

exports.createIntnote = (req, res) => {
  console.log(req.body);
  //

  const intnote = new Intnote(req.body);
  intnote.save();
  let {
    departmentName,
    eventName,
    location,
    eventDate,
    initiativeIs,
    ferequincy,
    stakeHoldersMember,
    stakeHoldersNoMember,
    initiativeNeeds,
    dgParticipation,
    speechTopic,
    speechPoints,
    speechDuration,
    speechDate,
    eventAttended,
    eventPartnership,
    eventStateMember,
    numCoverage,
    coverageFor,
    inpactInternal,
    internalSupport,
    internalSupportNeededSup,
    internalSupportNeededSpo,
  } = req.body;
  const doc = new PDFDocument();

  doc.image("controllers/assets/picto.png", 50, 0, { width: 70 });
  doc.image("controllers/assets/ecriture.png", 400, 15, { width: 170 });
  doc
    .fontSize(24)
    .font("Times-Bold")
    .fillColor("#008080")
    .text("Internal Memo for DG", { align: "center" });

  doc
    .fontSize(16)
    .font("Times-Bold")
    .fillColor("#7C9597")
    .text("PRESENTED BY", 20, 100);

  doc
    .fillColor("#000000")
    .fontSize(14)
    .font("Helvetica")
    .text(
      `department name : ${!departmentName ? "" : departmentName}`,
      20,
      120
    );

  doc.text(`event name : ${!eventName ? "" : eventName}`, 20, 140);
  doc.text(`location : ${!location ? "" : location}`, 20, 160);
  doc
    .text(`event Date : ${!eventDate ? "" : eventDate}`, 20, 180)
    .moveDown(0.5);
  doc
    .fontSize(16)
    .font("Times-Bold")
    .fillColor("#7C9597")
    .text("EVENT / PROJECT DETAILS", 20, 220);
  doc
    .fillColor("#000000")
    .fontSize(14)
    .font("Helvetica")
    .text(`initiativeIs : ${!initiativeIs ? "" : initiativeIs}`, 20, 240);
  doc.text(`ferequincy : ${!ferequincy ? "" : ferequincy}`, 20, 260);
  doc.text(
    `stakeHoldersMember : ${!stakeHoldersMember ? "" : stakeHoldersMember}`,
    20,
    280
  );
  doc.text(
    `initiativeNeeds : ${!initiativeNeeds ? "" : initiativeNeeds}`,
    20,
    300
  );
  doc.text(
    `stakeHoldersNoMember : ${
      !stakeHoldersNoMember ? "" : stakeHoldersNoMember
    }`,
    20,
    320
  );
  doc
    .fontSize(16)
    .font("Times-Bold")
    .fillColor("#7C9597")
    .text("DG PARTICIPATION INFORMATION", 20, 360);
  doc
    .fillColor("#000000")
    .fontSize(14)
    .font("Helvetica")
    .text(
      `dgParticipation : ${!dgParticipation ? "" : dgParticipation}`,
      20,
      380
    );
  doc.text(`speechTopic : ${!speechTopic ? "" : speechTopic} `, 20, 400);
  doc.text(`speechPoints : ${!speechPoints ? "" : speechPoints}`, 20, 420);
  doc.text(
    `speechDuration : ${!speechDuration ? "" : speechDuration}`,
    20,
    440
  );
  doc.text(`speechDate : ${!speechDate ? "" : speechDate}`, 20, 460);
  doc.text(`eventAttended : ${!eventAttended ? "" : eventAttended}`, 20, 480);
  doc.text(
    `eventPartnership : ${!eventPartnership ? "" : eventPartnership}`,
    20,
    500
  );
  doc.text(
    `eventStateMember : ${!eventStateMember ? "" : eventStateMember}`,
    20,
    520
  );
  doc.text(`numCoverage : ${!numCoverage ? "" : numCoverage}`, 20, 540);
  doc
    .fontSize(16)
    .font("Times-Bold")
    .fillColor("#7C9597")
    .text("FINANCIAL COVERAGE BY STAKEHOLDERS", 20, 580);
  doc
    .fillColor("#000000")
    .fontSize(14)
    .font("Helvetica")
    .text(`coverageFor : ${!coverageFor ? "" : coverageFor}`, 20, 600);
  doc.text(
    `inpactInternal : ${!inpactInternal ? "" : inpactInternal}`,
    20,
    620
  );
  doc.text(
    `internalSupport : ${!internalSupport ? "" : internalSupport} `,
    20,
    640
  );

  doc.text(
    `internalSupportNeededSup : ${
      !internalSupportNeededSup ? "" : internalSupportNeededSup
    }`,
    20,
    660
  );
  doc.text(
    `internalSupportNeededSpo : ${
      !internalSupportNeededSpo ? "" : internalSupportNeededSpo
    }`,
    20,
    680
  );
  doc
    .fontSize(16)
    .font("Times-Bold")
    .fillColor("#000")
    .text("DG directions", { align: "right" });

  doc.pipe(fs.createWriteStream("controllers/pdf/output.pdf")); // write to PDF
  doc.end();
  res.status(200).json({ message: "your request seccussfully submited" });
  sendEmail(
    req.body,
    "chegdali.amine@gmail.com, cabdg@icesco.org",
    req.body.invitation.base64,
    req.body.eventconcept.base64,
    req.body.attendees.base64
  );
};

exports.getIntnote = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["RegisteredAt" , "DESC"]';
  let filter = req.query.filter || "{}";
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);
  filter = JSON.parse(filter);
  if (filter.name) {
    filter.name = { $regex: ".*" + filter.name + ".*" };
  }
  if (filter.end) {
    let dateStr = new Date(filter.end);
    let nextDate = new Date(filter.end);
    nextDate.setDate(nextDate.getDate() + 1);
    console.log(dateStr, nextDate);
    filter.end = {
      $gte: new Date(dateStr),
      $lte: new Date(nextDate),
    };
  }
  //comment
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

  Intnote.countDocuments(filter, function (err, c) {
    count = c;
    // console.log("hello", c);
    let map = new Map([sort]);
    Intnote.find(filter)
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
          `intnote ${range[0]}-${range[1] + 1}/${count}`
        );
        res.status(200).json(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getIntnoteById = (req, res, next, id) => {
  Intnote.findById(id).exec((err, data) => {
    if (err) {
      return res.status(200).json({ error: "Internal Note for DG not found" });
    }
    req.intnote = data;

    next();
  });
};

exports.getOneIntnote = (req, res) => {
  intnote = req.intnote;
  if (intnote) {
    res.set("Content-Range", `leave 0-1/1`);
    res.json(intnote.transform());
  } else
    res.status(200).json({
      id: "",
      message: "Note not found",
    });
};

exports.updateIntnote = (req, res) => {
  let intnote = req.intnote;
  intnote = _.extend(intnote, req.body);
  intnote.save((err, intnote) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    return res.status(200).json(intnote.transform());
  });
};

exports.deleteIntnote = (req, res) => {
  let intnote = req.intnote;

  intnote.remove((err, intnote) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json({
      message: "Internal note deleted successfully",
    });
  });
};

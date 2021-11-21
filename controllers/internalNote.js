const Intnote = require("../models/internalNote");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const config = require("./config/config");

const OAuth2_client = new OAuth2(config.clientId, config.clientSecret);
OAuth2_client.setCredentials({ refresh_token: config.refreshToken });

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
    },
  });
  const mailOption = {
    from: `<${config.user}>`,
    to: recipient,
    subject: "DG internal Note",
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
  let path = "";
  const intnote = new Intnote(req.body);
  intnote.save();
  res.status(200).json({ message: "your request seccussfully submited" });
  sendEmail(
    req.body,
    "chegdali.amine@gmail.com, sohaibbakcha@gmail.com",
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

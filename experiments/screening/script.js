// Define study
const study = lab.util.fromObject({
  "title": "root",
  "type": "lab.flow.Sequence",
  "parameters": {},
  "plugins": [
    {
      "type": "lab.plugins.Metadata",
      "path": undefined
    },
    {
      "type": "lab.plugins.Transmit",
      "url": "backend.php",
      "path": undefined
    }
  ],
  "metadata": {
    "title": "Screening_Final",
    "description": "",
    "repository": "",
    "contributors": ""
  },
  "files": {},
  "responses": {},
  "content": [
    {
      "type": "lab.html.Form",
      "content": "\u003Cheader style=\"color: #DC143C;\"\u003E\n  \u003Ch2\u003ESafari as your Browser?\u003C\u002Fh2\u003E\n\u003C\u002Fheader\u003E\n\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\n    \u003Cp class=\"w-l text-justify\" style=font-size:24px\u003E\n      It seems that you are using \u003Cstrong\u003ESafari as your browser\u003C\u002Fstrong\u003E. For this experiment to work properly, this browser should be avoided. \n    \u003Cbr\u003E\u003Cbr\u003E\u003Cstrong\u003EPlease restart this experiment in either Chrome or Firefox\u003C\u002Fstrong\u003E. Please close the window now and start the program again with the link provided by the experimenter in either \u003Cstrong\u003EChrome\u003C\u002Fstrong\u003E or \u003Cstrong\u003EFirefox\u003C\u002Fstrong\u003E. Thank you!\n    \u003Cbr\u003E\u003Cbr\u003E\u003Cbr\u003E\u003Cbr\u003E\n    \u003C\u002Fp\u003E\n\u003C\u002Fmain\u003E",
      "scrollTop": true,
      "files": {},
      "responses": {},
      "parameters": {},
      "messageHandlers": {
        "before:prepare": function anonymous(
) {
if (this.state.meta.userAgent.indexOf("Safari") != -1){ // Safari is in userAgent
 if (this.state.meta.userAgent.indexOf("Chrome") != -1){ // Chrome is in userAgent
    if (this.state.meta.userAgent.indexOf("Chrome") < this.state.meta.userAgent.indexOf("Safari")){ // Chrome is mentioned before Safari => Chrome or Edge was used as Browser
      this.state.browserseq = "ok"
    } else { // Safari was used as Browser
      this.state.browserseq = "issue"
    }
  } else { // Only Safari is included => Safari was not used as Browser
    this.state.browserseq = "issue"
  } 
} else {
  this.state.browserseq = "ok"
}
}
      },
      "title": "Browser check",
      "tardy": true,
      "skip": "${this.state.browserseq == \"ok\"}"
    },
    {
      "type": "lab.flow.Sequence",
      "files": {},
      "responses": {},
      "parameters": {},
      "messageHandlers": {},
      "title": "Fullscreen_Sequence",
      "plugins": [
        {
          "type": "fullscreen",
          "message": "",
          "hint": "",
          "path": "lab.plugins.Fullscreen"
        }
      ],
      "content": [
        {
          "type": "lab.flow.Sequence",
          "files": {},
          "responses": {},
          "parameters": {},
          "messageHandlers": {
            "run": function anonymous(
) {
this.internals.root.parameters.prolific_ID = this.state.url.PROLIFIC_PID
this.internals.root.parameters.study_ID = this.state.url.STUDY_ID
this.internals.root.parameters.session_ID = this.state.url.SESSION_ID

},
            "after:prepare": function anonymous(
) {
window.scrollTo(0, 0);
}
          },
          "title": "Start_Sequence",
          "content": [
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Cheader\u003E\r\n  \u003Ch1 id=\"welcomeHeader\"\u003EScreening: Memorising Object Locations and Colours\u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "image",
                  "src": "${ this.files[\"pierre art.jpg\"] }",
                  "width": "",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "text",
                  "content": "Pierre Bonnard: The Colour of Memory (\"Window Open on the Seine\")"
                }
              ],
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {
                "Pier_art.jpg": "embedded\u002F36767d154b4ecd1616fffb8367233dc3694fe53b2257f68a0260df62e590f82d.jpg",
                "Sussex logo.jpg": "embedded\u002F303cfc6c1257fa9bda0d1f6e23cf2e6f1c88bc858d5d6800c41924beadb7bd2e.jpg",
                "pierre art.jpg": "embedded\u002F8edf859099c10624dabefc279d5e59ce0eb8f0cba65d0865c4a339e86da391f0.jpg"
              },
              "responses": {},
              "parameters": {},
              "messageHandlers": {
                "before:prepare": function anonymous(
) {
// Function to enable scrolling in full-screen mode
function enableScrollingInFullscreen(element) {
  element.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
}

// Call the function to enable scrolling in full-screen mode
enableScrollingInFullscreen(document.body);
}
              },
              "title": "Welcome",
              "width": "l"
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Cheader\u003E\r\n  \u003Ch1 id=\"welcomeHeader\"\u003EWelcome\u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Cp class = \"alert alter-warning\" \u003E Please tell us how you are joining us today so we provide you with the correct version of the tasks.  \u003C\u002Fp\u003E\r\n\r\n",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "radio",
                  "label": "I have joined using a link from:",
                  "options": [
                    {
                      "label": "Prolific",
                      "coding": "0"
                    },
                    {
                      "label": "Other (e.g., I was sent the link over email or by a relative) ",
                      "coding": "1"
                    }
                  ],
                  "name": "Link_origin"
                }
              ],
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Prolific_or_Link",
              "skip": true
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Cheader\u003E\r\n  \u003Ch1 id=\"welcomeHeader\"\u003EInformation\u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Cp\u003E Thank you for your interest in this study about how synaesthesia (a mixing of senses, for example seeing colours when reading black letters) runs in families. This screening session will take between \u003Cb\u003E 5-30 minutes \u003C\u002Fb\u003E of your time. Following this, if you are a relative of a synaesthete, you may be able to take part in the next three experimental sessions, which take approximately an hour each to complete (see below for an overview). \u003C\u002Fp\u003E\r\n    ",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "image",
                  "src": "${ this.files[\"Figures for RR.jpg\"] }",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "text",
                  "content": " \u003Cp\u003E If you are a synaesthete, we will only be asking you to complete two short tests of the most common types of synaesthesia and a brief questionnaire about whether you experience any other types, e.g., sound-colour.  \u003C\u002Fp\u003E\n\n \u003Cp\u003E If you are a relative, during this screening session, we will be checking whether you experience colourblindness and\u002For synaesthesia. You will need to have normal colour vision to take part in the study, but it doesn't matter whether the tests show that you may have synaesthesia. You will then have the option to continue on to the first session of the experiment. Here, we ask you to complete a computerised task where you have to memorise the colour and location of objects. The first session will take approximately 60 minutes. You may complete it either immediately or at a later date. \u003Cp\u003E\n\n"
                }
              ],
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {
                "Figures for RR.jpg": "embedded\u002F954537030e54370ab2ca0a1043bf3c7e3d9ef99b8b9d763f40028b849335d562.jpg"
              },
              "responses": {},
              "parameters": {},
              "messageHandlers": {
                "run": function anonymous(
) {
//Get screen resolution
var screenWidth = window.screen.width;
var screenHeight = window.screen.height;

// Calculate the screen resolution in pixels
var screenResolution = screenWidth * screenHeight;

// Save the data to the LabJS datastore
this.data.screenWidth = screenWidth;
this.data.screenHeight = screenHeight;
this.data.screenResolution = screenResolution

}
              },
              "title": "Info_ScreenRes",
              "width": "l"
            },
            {
              "type": "lab.html.Form",
              "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\n\u003Ccons class=\"text-left\" \u003E\n\n \u003Cheader\u003E\u003Ch1\u003EConsent Form\u003C\u002Fh1\u003E\u003C\u002Fheader\u003E\n\u003Cul\u003E\n \u003Cli\u003EI understand that by signing below I am agreeing to take part in the University of Sussex research described here, and that I have read and understood the information provided.\u003C\u002Fli\u003E\n \u003Cli\u003EI understand that my participation is entirely voluntary, that I can choose not to participate in part or all of the study, and that I can withdraw at any stage of testing without having to give a reason and without being penalised in any way (e.g., if I am a student, my decision whether or not to take part will not affect my grades).\u003C\u002Fli\u003E\n\u003Cli\u003EI understand that my personal data will be used for the purposes of this research study and will be handled in accordance with Data Protection legislation.  I understand that the University’s Privacy Notice provides further information on how the University uses personal data in its research.\n\u003C\u002Fli\u003E\n\u003Cli\u003EI understand that my collected data will be stored in a de-identified way (e.g. using ID numbers not names).  Electronic data will be stored securely on a University managed system, and hard-copies will be stored behind a locked door.\u003C\u002Fli\u003E\n\u003Cli\u003EI understand that my identity will remain confidential in any written reports of this research, and that no information I disclose will lead to the identification in those reports of any individual either by the researchers or by any other party, without first obtaining my written permission.\u003C\u002Fli\u003E\n\u003Cli\u003EI understand that my name or contact details will not be shared with any third party outside the research group, unless I later provide written permission. \u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003EIf you have any questions, please email \u003Ca href=\"mailto:emily.whelan@sussex.ac.uk\"\u003Eemily.whelan@sussex.ac.uk\u003C\u002Fa\u003E \u003C\u002Fp\u003E\n\n\u003Cp\u003EBy checking the box, I provide my consent to take part in this study.\u003C\u002Fp\u003E\n\n\u003Cform id=\"consent-form\"\u003E \n\u003Cfieldset\u003E\n\n \u003Cinput name = \"consent\" type=\"radio\" id=\"yes\"  value=\"yes\"\u003E \n \u003Clabel for =\"yes\"\u003E Yes, I confirm \u003C\u002Flabel\u003E \n \u003Cbr\u003E \u003C\u002Fbr\u003E\n \u003Cinput name = \"consent\" type=\"radio\"  id=\"no\" value=\"no\"required\u003E \n \u003Clabel for =\"no\"\u003E No, I don't confirm \u003C\u002Flabel\u003E \n\n\u003C\u002Ffieldset\u003E\n\u003C\u002Fform\u003E\n\u003C\u002Fcons\u003E  \n\u003C\u002Fmain\u003E\n\u003Cfooter\u003E\n\u003Cbutton id=\"buttonSubmit\" form=\"consent-form\"\u003ENext→\u003C\u002Fbutton\u003E\n\u003C\u002Ffooter\u003E\n\n\n",
              "files": {},
              "parameters": {},
              "responses": {},
              "messageHandlers": {},
              "title": "Consent"
            },
            {
              "type": "lab.html.Screen",
              "files": {
                "Pier_art.jpg": "embedded\u002F36767d154b4ecd1616fffb8367233dc3694fe53b2257f68a0260df62e590f82d.jpg"
              },
              "parameters": {},
              "responses": {},
              "messageHandlers": {
                "before:prepare": function anonymous(
) {
this.options.events['click'] = function() {

  lab.util.fullscreen.exit(document.body)

}
}
              },
              "title": "Consent_End",
              "content": "\u003Cheader\u003E\r\n  \u003Ch2\u003EThe session has ended.\u003C\u002Fh2\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n  \u003Csection class=\"w-l text-justify\"\u003E\r\n    \u003Cimg src=\"${ this.files[\"Pier_art.jpg\"] }\" width=\"700\"\u003E \u003C\u002Fimg\u003E\r\n    \u003Cfigcaption style=\"font-size:11px\"\u003EM Bleichner: Good Old Brighton Pier\u003C\u002Ffigcaption\u003E\r\n  \u003C\u002Fsection\u003E\r\n\u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n  \u003Ctable class=\"table-plain\"\u003E\r\n    \u003Ctr\u003E\r\n      \u003Ctd id=\"done\"\u003E\r\n        Click \u003Cb\u003Ehere\u003C\u002Fb\u003E to exit full screen mode. You can then close the window.\r\n      \u003C\u002Ftd\u003E\r\n    \u003C\u002Ftr\u003E\r\n  \u003C\u002Ftable\u003E\r\n\u003C\u002Ffooter\u003E",
              "skip": "${this.state.consent == \"yes\"}",
              "tardy": true
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Cheader\u003E \u003Ch1\u003E Participant Group \u003Ch1\u003E \u003C\u002Fheader\u003E",
                  "name": ""
                },
                {
                  "type": "text",
                  "content": "\u003Cp\u003EWe are interested in whether you have \u003Cb\u003Esynaesthesia\u003C\u002Fb\u003E or are the \u003Cb\u003Enon-synaesthetic first-degree relative\u003C\u002Fb\u003E of a synaesthete. We also ask for a little more information about you before we begin the screening tasks.\u003C\u002Fp\u003E\n\u003Cp\u003EAs mentioned, any email addresses or personal data you provide will be stored securely and handled in compliance with GDPR. This information will be used solely for the study and\u002For to enable follow-up communication and will not be shared with third parties. You have the right to access, correct, or delete your information at any time.\u003C\u002Fp\u003E",
                  "title": ""
                },
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Ctable\u003E\r\n  \u003Cthead\u003E\r\n    \u003Ctr\u003E\r\n      \u003Ctd\u003E\r\n        \u003Clabel for=\"group\"\u003E\u003Cb\u003EAre you a synaesthete or a relative?\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\r\n        \u003Cselect name=\"group\" required class=\"w-100\"\u003E\r\n          \u003Coption value=\"\" selected\u003E-- Study Group --\u003C\u002Foption\u003E\r\n          \u003Coption value=\"relative\"\u003ERelative\u003C\u002Foption\u003E\r\n          \u003Coption value=\"synaesthete\"\u003ESynaesthete\u003C\u002Foption\u003E\r\n        \u003C\u002Fselect\u003E\r\n        \u003Cdiv id=\"synaesthete\" style=\"display: none;\"\u003E\r\n          \u003Clabel for=\"custom-synaesthesia-input\"\u003E\u003Cb\u003E\u003Cbr\u003EPlease enter your email address here:\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\r\n          \u003Cinput type=\"text\" id=\"custom-synaesthesia-input\" name=\"synaestheteID\" placeholder=\"email\"\u003E\r\n        \u003C\u002Fdiv\u003E\r\n        \u003Cdiv id=\"relative\" style=\"display: none;\"\u003E\r\n          \u003Clabel for=\"relationship-to-synaesthete\"\u003E\u003Cb\u003EWhat is your relationship to the synaesthete? (e.g., parent, sibling)\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\r\n          \u003Cinput type=\"text\" id=\"relationship-to-synaesthete\" name=\"relationshipToSynesthete\" placeholder=\"Relationship\"\u003E\r\n          \u003Cbr\u003E\r\n          \u003Clabel for=\"relative-name-email\"\u003E\u003Cb\u003EPlease enter your email address:\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\r\n          \u003Cbr\u003E\r\n          \u003Cinput type=\"text\" id=\"relative-name-email\" name=\"relativeNameEmail\" placeholder=\"Name or Email\"\u003E\r\n        \u003C\u002Fdiv\u003E\r\n      \u003C\u002Ftd\u003E\r\n    \u003C\u002Ftr\u003E\r\n  \u003C\u002Fthead\u003E\r\n\u003C\u002Ftable\u003E\r\n",
                  "name": ""
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {
                "run": function anonymous(
) {
const synaesthesiaSelect = document.querySelector('select[name="group"]');
const synaesthesiaDetailsDiv = document.querySelector('#synaesthete');
const synaesthesiaDetailsInput = document.querySelector('#custom-synaesthesia-input');
const relativeDetailsDiv = document.querySelector('#relative');
const relativeDetailsInput = document.querySelector('#relative-name-email');
const relationshipInput = document.querySelector('#relationship-to-synaesthete'); // New input for relationship

synaesthesiaSelect.addEventListener('change', (event) => {
  const selectedValue = event.target.value;

  if (selectedValue === 'synaesthete') {
    synaesthesiaDetailsDiv.style.display = 'block';
    synaesthesiaDetailsInput.setAttribute('required', 'required');
  } else {
    synaesthesiaDetailsDiv.style.display = 'none';
    synaesthesiaDetailsInput.removeAttribute('required');
  }

  if (selectedValue === 'relative') {
    relativeDetailsDiv.style.display = 'block';
    relativeDetailsInput.setAttribute('required', 'required');
    relationshipInput.setAttribute('required', 'required'); // Make relationship input required
  } else {
    relativeDetailsDiv.style.display = 'none';
    relativeDetailsInput.removeAttribute('required');
    relationshipInput.removeAttribute('required');
  }
});




  
}
              },
              "title": "Participant_Group_Link",
              "width": "l",
              "tardy": true
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Cheader\u003E \u003Ch1\u003E Demographics Questionnaire \u003Ch1\u003E \u003C\u002Fheader\u003E",
                  "name": ""
                },
                {
                  "type": "text",
                  "content": "As part of this experiment, we also need some information about you. Please select the option that applies to you for the following information.",
                  "title": ""
                },
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Ctable\u003E\n\u003Cthead\u003E\n  \u003Ctr\u003E\n    \u003Ctd\u003E\n\n      \u003Cselect name=\"day_of_birth\" required class=\"w-100\"\u003E\n        \u003Coption value=\"\" selected\u003E\n          -- Day of Birth --\n        \u003C\u002Foption\u003E\n          \u003Coption value=\"01\"\u003E01\u003C\u002Foption\u003E\n          \u003Coption value=\"02\"\u003E02\u003C\u002Foption\u003E\n          \u003Coption value=\"03\"\u003E03\u003C\u002Foption\u003E\n          \u003Coption value=\"04\"\u003E04\u003C\u002Foption\u003E\n          \u003Coption value=\"05\"\u003E05\u003C\u002Foption\u003E\n          \u003Coption value=\"06\"\u003E06\u003C\u002Foption\u003E\n          \u003Coption value=\"07\"\u003E07\u003C\u002Foption\u003E\n          \u003Coption value=\"08\"\u003E08\u003C\u002Foption\u003E\n          \u003Coption value=\"09\"\u003E09\u003C\u002Foption\u003E\n          \u003Coption value=\"10\"\u003E10\u003C\u002Foption\u003E\n          \u003Coption value=\"11\"\u003E11\u003C\u002Foption\u003E\n          \u003Coption value=\"12\"\u003E12\u003C\u002Foption\u003E\n          \u003Coption value=\"13\"\u003E13\u003C\u002Foption\u003E\n          \u003Coption value=\"14\"\u003E14\u003C\u002Foption\u003E\n          \u003Coption value=\"15\"\u003E15\u003C\u002Foption\u003E\n          \u003Coption value=\"16\"\u003E16\u003C\u002Foption\u003E\n          \u003Coption value=\"17\"\u003E17\u003C\u002Foption\u003E\n          \u003Coption value=\"18\"\u003E18\u003C\u002Foption\u003E\n          \u003Coption value=\"19\"\u003E19\u003C\u002Foption\u003E\n          \u003Coption value=\"20\"\u003E20\u003C\u002Foption\u003E\n          \u003Coption value=\"21\"\u003E21\u003C\u002Foption\u003E\n          \u003Coption value=\"22\"\u003E22\u003C\u002Foption\u003E\n          \u003Coption value=\"23\"\u003E23\u003C\u002Foption\u003E\n          \u003Coption value=\"24\"\u003E24\u003C\u002Foption\u003E\n          \u003Coption value=\"25\"\u003E25\u003C\u002Foption\u003E\n          \u003Coption value=\"26\"\u003E26\u003C\u002Foption\u003E\n          \u003Coption value=\"27\"\u003E27\u003C\u002Foption\u003E\n          \u003Coption value=\"28\"\u003E28\u003C\u002Foption\u003E\n          \u003Coption value=\"29\"\u003E29\u003C\u002Foption\u003E\n          \u003Coption value=\"30\"\u003E30\u003C\u002Foption\u003E\n          \u003Coption value=\"31\"\u003E31\u003C\u002Foption\u003E\n\u003C\u002Fselect\u003E\n\n    \u003C\u002Ftd\u003E\n    \u003Ctd\u003E\n\n      \u003Cselect name=\"month_of_birth\" required class=\"w-100\"\u003E\n        \u003Coption value=\"\" selected\u003E\n          -- Month of Birth --\n        \u003C\u002Foption\u003E\n          \u003Coption value=\"01\"\u003EJanuary\u003C\u002Foption\u003E\n          \u003Coption value=\"02\"\u003EFebruary\u003C\u002Foption\u003E\n          \u003Coption value=\"03\"\u003EMarch\u003C\u002Foption\u003E\n          \u003Coption value=\"04\"\u003EApril\u003C\u002Foption\u003E\n          \u003Coption value=\"05\"\u003EMay\u003C\u002Foption\u003E\n          \u003Coption value=\"06\"\u003EJune\u003C\u002Foption\u003E\n          \u003Coption value=\"07\"\u003EJuly\u003C\u002Foption\u003E\n          \u003Coption value=\"08\"\u003EAugust\u003C\u002Foption\u003E\n          \u003Coption value=\"09\"\u003ESeptember\u003C\u002Foption\u003E\n          \u003Coption value=\"10\"\u003EOctober\u003C\u002Foption\u003E\n          \u003Coption value=\"11\"\u003ENovember\u003C\u002Foption\u003E\n          \u003Coption value=\"12\"\u003EDecember\u003C\u002Foption\u003E\n      \u003C\u002Fselect\u003E\n\n  \u003C\u002Ftd\u003E\n\u003Ctd\u003E\n  \n      \u003Cselect name=\"year_of_birth\" required class=\"w-100\"\u003E\n        \u003Coption value=\"\" selected\u003E\n          -- Year of Birth --\n        \u003C\u002Foption\u003E\n          \u003Coption value=\"1900\"\u003E1900\u003C\u002Foption\u003E\n          \u003Coption value=\"1901\"\u003E1901\u003C\u002Foption\u003E\n          \u003Coption value=\"1902\"\u003E1902\u003C\u002Foption\u003E\n          \u003Coption value=\"1903\"\u003E1903\u003C\u002Foption\u003E\n          \u003Coption value=\"1904\"\u003E1904\u003C\u002Foption\u003E\n          \u003Coption value=\"1905\"\u003E1905\u003C\u002Foption\u003E\n          \u003Coption value=\"1906\"\u003E1906\u003C\u002Foption\u003E\n          \u003Coption value=\"1907\"\u003E1907\u003C\u002Foption\u003E\n          \u003Coption value=\"1908\"\u003E1908\u003C\u002Foption\u003E\n          \u003Coption value=\"1909\"\u003E1909\u003C\u002Foption\u003E\n          \u003Coption value=\"1910\"\u003E1910\u003C\u002Foption\u003E\n          \u003Coption value=\"1911\"\u003E1911\u003C\u002Foption\u003E\n          \u003Coption value=\"1912\"\u003E1912\u003C\u002Foption\u003E\n          \u003Coption value=\"1913\"\u003E1913\u003C\u002Foption\u003E\n          \u003Coption value=\"1914\"\u003E1914\u003C\u002Foption\u003E\n          \u003Coption value=\"1915\"\u003E1915\u003C\u002Foption\u003E\n          \u003Coption value=\"1916\"\u003E1916\u003C\u002Foption\u003E\n          \u003Coption value=\"1917\"\u003E1917\u003C\u002Foption\u003E\n          \u003Coption value=\"1918\"\u003E1918\u003C\u002Foption\u003E\n          \u003Coption value=\"1919\"\u003E1919\u003C\u002Foption\u003E\n          \u003Coption value=\"1920\"\u003E1920\u003C\u002Foption\u003E\n          \u003Coption value=\"1921\"\u003E1921\u003C\u002Foption\u003E\n          \u003Coption value=\"1922\"\u003E1922\u003C\u002Foption\u003E\n          \u003Coption value=\"1923\"\u003E1923\u003C\u002Foption\u003E\n          \u003Coption value=\"1924\"\u003E1924\u003C\u002Foption\u003E\n          \u003Coption value=\"1925\"\u003E1925\u003C\u002Foption\u003E\n          \u003Coption value=\"1926\"\u003E1926\u003C\u002Foption\u003E\n          \u003Coption value=\"1927\"\u003E1927\u003C\u002Foption\u003E\n          \u003Coption value=\"1928\"\u003E1928\u003C\u002Foption\u003E\n          \u003Coption value=\"1929\"\u003E1929\u003C\u002Foption\u003E\n          \u003Coption value=\"1930\"\u003E1930\u003C\u002Foption\u003E\n          \u003Coption value=\"1931\"\u003E1931\u003C\u002Foption\u003E\n          \u003Coption value=\"1932\"\u003E1932\u003C\u002Foption\u003E\n          \u003Coption value=\"1933\"\u003E1933\u003C\u002Foption\u003E\n          \u003Coption value=\"1934\"\u003E1934\u003C\u002Foption\u003E\n          \u003Coption value=\"1935\"\u003E1935\u003C\u002Foption\u003E\n          \u003Coption value=\"1936\"\u003E1936\u003C\u002Foption\u003E\n          \u003Coption value=\"1937\"\u003E1937\u003C\u002Foption\u003E\n          \u003Coption value=\"1938\"\u003E1938\u003C\u002Foption\u003E\n          \u003Coption value=\"1939\"\u003E1939\u003C\u002Foption\u003E\n          \u003Coption value=\"1940\"\u003E1940\u003C\u002Foption\u003E\n          \u003Coption value=\"1941\"\u003E1941\u003C\u002Foption\u003E\n          \u003Coption value=\"1942\"\u003E1942\u003C\u002Foption\u003E\n          \u003Coption value=\"1943\"\u003E1943\u003C\u002Foption\u003E\n          \u003Coption value=\"1944\"\u003E1944\u003C\u002Foption\u003E\n          \u003Coption value=\"1945\"\u003E1945\u003C\u002Foption\u003E\n          \u003Coption value=\"1946\"\u003E1946\u003C\u002Foption\u003E\n          \u003Coption value=\"1947\"\u003E1947\u003C\u002Foption\u003E\n          \u003Coption value=\"1948\"\u003E1948\u003C\u002Foption\u003E\n          \u003Coption value=\"1949\"\u003E1949\u003C\u002Foption\u003E\n          \u003Coption value=\"1950\"\u003E1950\u003C\u002Foption\u003E\n          \u003Coption value=\"1951\"\u003E1951\u003C\u002Foption\u003E\n          \u003Coption value=\"1952\"\u003E1952\u003C\u002Foption\u003E\n          \u003Coption value=\"1953\"\u003E1953\u003C\u002Foption\u003E\n          \u003Coption value=\"1954\"\u003E1954\u003C\u002Foption\u003E\n          \u003Coption value=\"1955\"\u003E1955\u003C\u002Foption\u003E\n          \u003Coption value=\"1956\"\u003E1956\u003C\u002Foption\u003E\n          \u003Coption value=\"1957\"\u003E1957\u003C\u002Foption\u003E\n          \u003Coption value=\"1958\"\u003E1958\u003C\u002Foption\u003E\n          \u003Coption value=\"1959\"\u003E1959\u003C\u002Foption\u003E\n          \u003Coption value=\"1960\"\u003E1960\u003C\u002Foption\u003E\n          \u003Coption value=\"1961\"\u003E1961\u003C\u002Foption\u003E\n          \u003Coption value=\"1962\"\u003E1962\u003C\u002Foption\u003E\n          \u003Coption value=\"1963\"\u003E1963\u003C\u002Foption\u003E\n          \u003Coption value=\"1964\"\u003E1964\u003C\u002Foption\u003E\n          \u003Coption value=\"1965\"\u003E1965\u003C\u002Foption\u003E\n          \u003Coption value=\"1966\"\u003E1966\u003C\u002Foption\u003E\n          \u003Coption value=\"1967\"\u003E1967\u003C\u002Foption\u003E\n          \u003Coption value=\"1968\"\u003E1968\u003C\u002Foption\u003E\n          \u003Coption value=\"1969\"\u003E1969\u003C\u002Foption\u003E\n          \u003Coption value=\"1970\"\u003E1970\u003C\u002Foption\u003E\n          \u003Coption value=\"1971\"\u003E1971\u003C\u002Foption\u003E\n          \u003Coption value=\"1972\"\u003E1972\u003C\u002Foption\u003E\n          \u003Coption value=\"1973\"\u003E1973\u003C\u002Foption\u003E\n          \u003Coption value=\"1974\"\u003E1974\u003C\u002Foption\u003E\n          \u003Coption value=\"1975\"\u003E1975\u003C\u002Foption\u003E\n          \u003Coption value=\"1976\"\u003E1976\u003C\u002Foption\u003E\n          \u003Coption value=\"1977\"\u003E1977\u003C\u002Foption\u003E\n          \u003Coption value=\"1978\"\u003E1978\u003C\u002Foption\u003E\n          \u003Coption value=\"1979\"\u003E1979\u003C\u002Foption\u003E\n          \u003Coption value=\"1980\"\u003E1980\u003C\u002Foption\u003E\n          \u003Coption value=\"1981\"\u003E1981\u003C\u002Foption\u003E\n          \u003Coption value=\"1982\"\u003E1982\u003C\u002Foption\u003E\n          \u003Coption value=\"1983\"\u003E1983\u003C\u002Foption\u003E\n          \u003Coption value=\"1984\"\u003E1984\u003C\u002Foption\u003E\n          \u003Coption value=\"1985\"\u003E1985\u003C\u002Foption\u003E\n          \u003Coption value=\"1986\"\u003E1986\u003C\u002Foption\u003E\n          \u003Coption value=\"1987\"\u003E1987\u003C\u002Foption\u003E\n          \u003Coption value=\"1988\"\u003E1988\u003C\u002Foption\u003E\n          \u003Coption value=\"1989\"\u003E1989\u003C\u002Foption\u003E\n          \u003Coption value=\"1990\"\u003E1990\u003C\u002Foption\u003E\n          \u003Coption value=\"1991\"\u003E1991\u003C\u002Foption\u003E\n          \u003Coption value=\"1992\"\u003E1992\u003C\u002Foption\u003E\n          \u003Coption value=\"1993\"\u003E1993\u003C\u002Foption\u003E\n          \u003Coption value=\"1994\"\u003E1994\u003C\u002Foption\u003E\n          \u003Coption value=\"1995\"\u003E1995\u003C\u002Foption\u003E\n          \u003Coption value=\"1996\"\u003E1996\u003C\u002Foption\u003E\n          \u003Coption value=\"1997\"\u003E1997\u003C\u002Foption\u003E\n          \u003Coption value=\"1998\"\u003E1998\u003C\u002Foption\u003E\n          \u003Coption value=\"1999\"\u003E1999\u003C\u002Foption\u003E\n          \u003Coption value=\"2000\"\u003E2000\u003C\u002Foption\u003E\n          \u003Coption value=\"2001\"\u003E2001\u003C\u002Foption\u003E\n          \u003Coption value=\"2002\"\u003E2002\u003C\u002Foption\u003E\n          \u003Coption value=\"2003\"\u003E2003\u003C\u002Foption\u003E\n          \u003Coption value=\"2004\"\u003E2004\u003C\u002Foption\u003E\n          \u003Coption value=\"2005\"\u003E2005\u003C\u002Foption\u003E\n          \u003Coption value=\"2006\"\u003E2006\u003C\u002Foption\u003E\n          \u003Coption value=\"2007\"\u003E2007\u003C\u002Foption\u003E\n          \u003Coption value=\"2008\"\u003E2008\u003C\u002Foption\u003E\n          \u003Coption value=\"2009\"\u003E2009\u003C\u002Foption\u003E\n          \u003Coption value=\"2010\"\u003E2010\u003C\u002Foption\u003E\n          \u003Coption value=\"2011\"\u003E2011\u003C\u002Foption\u003E\n          \u003Coption value=\"2012\"\u003E2012\u003C\u002Foption\u003E\n          \u003Coption value=\"2013\"\u003E2013\u003C\u002Foption\u003E\n          \u003Coption value=\"2014\"\u003E2014\u003C\u002Foption\u003E\n          \u003Coption value=\"2015\"\u003E2015\u003C\u002Foption\u003E\n          \u003Coption value=\"2016\"\u003E2016\u003C\u002Foption\u003E\n          \u003Coption value=\"2017\"\u003E2017\u003C\u002Foption\u003E\n          \u003Coption value=\"2018\"\u003E2018\u003C\u002Foption\u003E\n          \u003Coption value=\"2019\"\u003E2019\u003C\u002Foption\u003E\n          \u003Coption value=\"2020\"\u003E2020\u003C\u002Foption\u003E\n          \u003Coption value=\"2021\"\u003E2021\u003C\u002Foption\u003E\n          \u003Coption value=\"2022\"\u003E2022\u003C\u002Foption\u003E\n      \u003C\u002Fselect\u003E\n      \n    \u003C\u002Ftd\u003E\n  \u003C\u002Ftr\u003E\n\u003C\u002Fthead\u003E\n\u003C\u002Ftable\u003E",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Ctable\u003E\n  \u003Cthead\u003E\n   \u003Ctr\u003E\n      \u003Ctd\u003E\n        \u003Cselect name=\"gender\" required class=\"w-100\"\u003E\n          \u003Coption value=\"\" selected\u003E-- Gender --\u003C\u002Foption\u003E\n          \u003Coption value=\"female\"\u003EFemale \u003C\u002Foption\u003E\n          \u003Coption value=\"male\"\u003EMale\u003C\u002Foption\u003E\n          \u003Coption value=\"prefer-not-to-say\"\u003EPrefer not to say\u003C\u002Foption\u003E\n          \u003Coption value=\"custom\"\u003EPrefer to describe self as (please specify):\u003C\u002Foption\u003E\n        \u003C\u002Fselect\u003E\n        \u003Cdiv id=\"custom-gender\" style=\"display: none;\"\u003E\n          \u003Clabel for=\"custom-gender-input\"\u003EEnter your gender:\u003C\u002Flabel\u003E\n          \u003Cinput type=\"text\" id=\"custom-gender-input\" name=\"custom_gender\" placeholder=\"Enter your gender\"\u003E\n        \u003C\u002Fdiv\u003E\n      \u003C\u002Ftd\u003E\n    \u003C\u002Ftr\u003E\n  \u003C\u002Fthead\u003E\n\u003C\u002Ftable\u003E\n\n\n",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Ctable\u003E\n\u003Cthead\u003E\n  \u003Ctr\u003E\n    \u003Ctd\u003E\n\n      \u003Cselect name=\"handedness\" required class=\"w-100\"\u003E\n        \u003Coption value=\"\" selected\u003E\n          -- Handedness --\n        \u003C\u002Foption\u003E\n          \u003Coption value=\"right\"\u003ERight-handed\u003C\u002Foption\u003E\n          \u003Coption value=\"left\"\u003ELeft-handed\u003C\u002Foption\u003E\n          \u003Coption value=\"ambidextrous\"\u003EAmbidextrous\u003C\u002Foption\u003E\n      \u003C\u002Fselect\u003E\n\n    \u003C\u002Ftd\u003E\n  \u003C\u002Ftr\u003E\n\u003C\u002Fthead\u003E\n\u003C\u002Ftable\u003E",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Ctable\u003E\n\u003Cthead\u003E\n  \u003Ctr\u003E\n    \u003Ctd\u003E\n\n      \u003Cselect name=\"education\" required class=\"w-100\"\u003E\n        \u003Coption value=\"\" selected\u003E\n          -- Highest Level of Education --\n        \u003C\u002Foption\u003E\n          \u003Coption value=\"1\"\u003EPrimary School\u003C\u002Foption\u003E\n          \u003Coption value=\"2\"\u003ESecondary School up to 16 years\u003C\u002Foption\u003E\n          \u003Coption value=\"3\"\u003EHigher or secondary or further education (A-levels, BTEC, etc.)\u003C\u002Foption\u003E\n          \u003Coption value=\"4\"\u003ECollege or university\u003C\u002Foption\u003E\n          \u003Coption value=\"5\"\u003EPostgraduate degree\u003C\u002Foption\u003E\n          \u003Coption value=\"6\"\u003EPrefer not to say\u003C\u002Foption\u003E\n    \n      \u003C\u002Fselect\u003E\n\n    \u003C\u002Ftd\u003E\n  \u003C\u002Ftr\u003E\n\u003C\u002Fthead\u003E\n\u003C\u002Ftable\u003E",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Ctable\u003E\n\u003Cthead\u003E\n  \u003Ctr\u003E\n    \u003Ctd\u003E\n\n      \u003Cselect name=\"language\" required class=\"w-100\"\u003E\n        \u003Coption value=\"\" selected\u003E\n          -- First language --\n        \u003C\u002Foption\u003E\n          \u003Coption value=\"english\"\u003EEnglish\u003C\u002Foption\u003E\n          \u003Coption value=\"english_other\"\u003EMultiple first languages: English and other(s)\u003C\u002Foption\u003E\n          \u003Coption value=\"good_english\"\u003EOther, but good English skills\u003C\u002Foption\u003E\n         \u003Coption value=\"basic_english\"\u003EOther, limited English skills\u003C\u002Foption\u003E\n      \u003C\u002Fselect\u003E\n\n    \u003C\u002Ftd\u003E\n  \u003C\u002Ftr\u003E\n\u003C\u002Fthead\u003E\n\u003C\u002Ftable\u003E",
                  "name": ""
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {
                "run": function anonymous(
) {
// Allow self-description of gender identity 
 
  const genderSelect = document.querySelector('select[name="gender"]');
  const customGenderDiv = document.querySelector('#custom-gender');
  const customGenderInput = document.querySelector('#custom-gender-input');
  const synaesthesiaSelect = document.querySelector('select[name="group"]');
  const synaesthesiaDetailsDiv = document.querySelector('#synaesthete-id');
  const synaesthesiaDetailsInput = document.querySelector('#custom-synaesthesia-input');

  genderSelect.addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === 'custom') {
      customGenderDiv.style.display = 'block';
      customGenderInput.setAttribute('required', 'required');
    } else {
      customGenderDiv.style.display = 'none';
      customGenderInput.removeAttribute('required');
    }

  synaesthesiaSelect.addEventListener('change', (event) => {
  const selectedValue = event.target.value;
  if (selectedValue === 'synaesthete' || selectedValue === 'synaesthete-id') {
    synaesthesiaDetailsDiv.style.display = 'block';
    synaesthesiaDetailsInput.setAttribute('required', 'required');
  } else {
    synaesthesiaDetailsDiv.style.display = 'none';
    synaesthesiaDetailsInput.removeAttribute('required');
  }
})
})


  
}
              },
              "title": "Relative_Demographics",
              "width": "l",
              "tardy": true,
              "skip": "${this.state['group'] !='relative'}"
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Cheader\u003E \u003Ch1\u003E Demographics Questionnaire \u003Ch1\u003E \u003C\u002Fheader\u003E",
                  "name": ""
                },
                {
                  "type": "text",
                  "content": "As part of this experiment, we also need some information about you. Please select the option that applies to you for the following information.",
                  "title": ""
                },
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Ctable\u003E\n  \u003Cthead\u003E\n   \u003Ctr\u003E\n      \u003Ctd\u003E\n        \u003Cselect name=\"gender\" required class=\"w-100\"\u003E\n          \u003Coption value=\"\" selected\u003E-- Gender --\u003C\u002Foption\u003E\n          \u003Coption value=\"female\"\u003EFemale \u003C\u002Foption\u003E\n          \u003Coption value=\"male\"\u003EMale\u003C\u002Foption\u003E\n          \u003Coption value=\"prefer-not-to-say\"\u003EPrefer not to say\u003C\u002Foption\u003E\n          \u003Coption value=\"custom\"\u003EPrefer to describe self as (please specify):\u003C\u002Foption\u003E\n        \u003C\u002Fselect\u003E\n        \u003Cdiv id=\"custom-gender\" style=\"display: none;\"\u003E\n          \u003Clabel for=\"custom-gender-input\"\u003EEnter your gender:\u003C\u002Flabel\u003E\n          \u003Cinput type=\"text\" id=\"custom-gender-input\" name=\"custom_gender\" placeholder=\"Enter your gender\"\u003E\n        \u003C\u002Fdiv\u003E\n      \u003C\u002Ftd\u003E\n    \u003C\u002Ftr\u003E\n  \u003C\u002Fthead\u003E\n\u003C\u002Ftable\u003E\n\n\n",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Ctable\u003E\n\u003Cthead\u003E\n  \u003Ctr\u003E\n    \u003Ctd\u003E\n\n      \u003Cselect name=\"handedness\" required class=\"w-100\"\u003E\n        \u003Coption value=\"\" selected\u003E\n          -- Handedness --\n        \u003C\u002Foption\u003E\n          \u003Coption value=\"right\"\u003ERight-handed\u003C\u002Foption\u003E\n          \u003Coption value=\"left\"\u003ELeft-handed\u003C\u002Foption\u003E\n          \u003Coption value=\"ambidextrous\"\u003EAmbidextrous\u003C\u002Foption\u003E\n      \u003C\u002Fselect\u003E\n\n    \u003C\u002Ftd\u003E\n  \u003C\u002Ftr\u003E\n\u003C\u002Fthead\u003E\n\u003C\u002Ftable\u003E",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Ctable\u003E\n\u003Cthead\u003E\n  \u003Ctr\u003E\n    \u003Ctd\u003E\n\n      \u003Cselect name=\"education\" required class=\"w-100\"\u003E\n        \u003Coption value=\"\" selected\u003E\n          -- Highest Level of Education --\n        \u003C\u002Foption\u003E\n          \u003Coption value=\"1\"\u003EPrimary School\u003C\u002Foption\u003E\n          \u003Coption value=\"2\"\u003ESecondary School up to 16 years\u003C\u002Foption\u003E\n          \u003Coption value=\"3\"\u003EHigher or secondary or further education (A-levels, BTEC, etc.)\u003C\u002Foption\u003E\n          \u003Coption value=\"4\"\u003ECollege or university\u003C\u002Foption\u003E\n          \u003Coption value=\"5\"\u003EPostgraduate degree\u003C\u002Foption\u003E\n          \u003Coption value=\"6\"\u003EPrefer not to say\u003C\u002Foption\u003E\n    \n      \u003C\u002Fselect\u003E\n\n    \u003C\u002Ftd\u003E\n  \u003C\u002Ftr\u003E\n\u003C\u002Fthead\u003E\n\u003C\u002Ftable\u003E",
                  "name": ""
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {
                "run": function anonymous(
) {
// Allow self-description of gender identity 
 
  const genderSelect = document.querySelector('select[name="gender"]');
  const customGenderDiv = document.querySelector('#custom-gender');
  const customGenderInput = document.querySelector('#custom-gender-input');
  const synaesthesiaSelect = document.querySelector('select[name="group"]');
  const synaesthesiaDetailsDiv = document.querySelector('#synaesthete-id');
  const synaesthesiaDetailsInput = document.querySelector('#custom-synaesthesia-input');

  genderSelect.addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === 'custom') {
      customGenderDiv.style.display = 'block';
      customGenderInput.setAttribute('required', 'required');
    } else {
      customGenderDiv.style.display = 'none';
      customGenderInput.removeAttribute('required');
    }

  synaesthesiaSelect.addEventListener('change', (event) => {
  const selectedValue = event.target.value;
  if (selectedValue === 'synaesthete' || selectedValue === 'synaesthete-id') {
    synaesthesiaDetailsDiv.style.display = 'block';
    synaesthesiaDetailsInput.setAttribute('required', 'required');
  } else {
    synaesthesiaDetailsDiv.style.display = 'none';
    synaesthesiaDetailsInput.removeAttribute('required');
  }
})
})


  
}
              },
              "title": "Syn_Demographics",
              "width": "l",
              "tardy": true,
              "skip": "${this.state['group'] !='synaesthete'}"
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "text",
                  "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\n\u003Ccons class=\"text-left\" \u003E\n\n \u003Cheader\u003E\u003Ch1\u003EScreening Checks\u003C\u002Fh1\u003E\u003C\u002Fheader\u003E\n",
                  "title": ""
                },
                {
                  "type": "text",
                  "title": "Colour Blindness",
                  "content": "We will check for colourblindess in two ways: (1) by showing you a series of images with red and green numbers embedded in them and (2) by asking you to arrange colours in a sequence. "
                },
                {
                  "required": true,
                  "type": "text",
                  "content": "We are particularly interested in whether there are any differences in results between those who have synaesthesia and those who do not. Don't worry if this doesn't make sense at the moment - we will explain more about what we mean by synaesthesia shortly and will get you to do a short test for synaesthesia! We will let you know over the course of this research if you do have synaesthesia. ",
                  "title": "Synaesthesia "
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Screening_Info_Prolific",
              "width": "l",
              "tardy": true,
              "skip": true
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "text",
                  "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\n\u003Ccons class=\"text-left\" \u003E\n\n \u003Cheader\u003E\u003Ch1\u003EScreening Checks\u003C\u002Fh1\u003E\u003C\u002Fheader\u003E\n",
                  "title": ""
                },
                {
                  "required": true,
                  "type": "text",
                  "content": "We will briefly check which types of synaesthesia you experience now. There are two short computerised tasks followed by a brief questionnaire.\n",
                  "title": "Synaesthesia "
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Screening_Info_Link_Synaesthete",
              "width": "l",
              "tardy": true,
              "skip": "${this.state['group'] !== 'synaesthete'}"
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "text",
                  "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\n\u003Ccons class=\"text-left\" \u003E\n\n \u003Cheader\u003E\u003Ch1\u003EScreening Checks\u003C\u002Fh1\u003E\u003C\u002Fheader\u003E\n",
                  "title": ""
                },
                {
                  "type": "text",
                  "title": "Colour Blindness",
                  "content": "We will check for colour blindess in two ways: (1) by showing you a series of images with red and green numbers embedded in them and (2) by asking you to arrange colours in a sequence. "
                },
                {
                  "required": true,
                  "type": "text",
                  "content": "We will briefly explain what synaesthesia is and ask you to complete a short test for synaesthesia. This will take between 5-20 minutes. We will let you know over the course of this research if you too have synaesthesia.  \u003C\u002Fp\u003E",
                  "title": "Synaesthesia "
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Screening_Info_Link_Relative",
              "width": "l",
              "tardy": true,
              "skip": "${this.state['group'] !== 'relative'}"
            },
            {
              "type": "lab.flow.Sequence",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Scaling_Sequence",
              "content": [
                {
                  "type": "lab.html.Page",
                  "items": [
                    {
                      "required": true,
                      "type": "html",
                      "content": "\u003Cheader\u003E \u003Ch1\u003E Resizing task materials \u003C\u002Fh1\u003E \u003C\u002Fheader\u003E\n\n\u003Cp class=\"alert alter-warning\" style=\"font-size: 20px;\"\u003E Do you have a \u003Cstrong\u003E credit card sized card \u003C\u002Fstrong\u003E handy? If not, please get one now so that we can use it as a screen size reference. We can then make sure that all images are presented at the correct size on your screen. \u003C\u002Fp\u003E\n",
                      "name": ""
                    },
                    {
                      "required": true,
                      "type": "text",
                      "title": "Instructions",
                      "content": "On the next page, you will see a rectangle. If you move the slider to the right with the mouse, the rectangle becomes larger. If you move the slider to the left, the rectangle becomes smaller. \u003Cbr\u003E \u003Cbr\u003E\nPlace your credit sized card against the computer screen and adjust the size of the rectangle using the scale until the credit card fits neatly within the rectangle borders. \u003Cbr\u003E\u003Cbr\u003E\nThis is very important so try to be as \u003Cstrong\u003Eaccurate\u003C\u002Fstrong\u003E as possible. \n"
                    }
                  ],
                  "scrollTop": true,
                  "submitButtonText": "Next→",
                  "submitButtonPosition": "right",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Scaling instructions",
                  "width": "l"
                },
                {
                  "type": "lab.flow.Sequence",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Scaling sequence",
                  "content": [
                    {
                      "type": "lab.flow.Loop",
                      "templateParameters": [
                        {
                          "ScalingChecknr": "1"
                        },
                        {
                          "ScalingChecknr": "2"
                        },
                        {
                          "ScalingChecknr": "3"
                        },
                        {
                          "ScalingChecknr": "4"
                        },
                        {
                          "ScalingChecknr": "5"
                        },
                        {
                          "ScalingChecknr": "6"
                        },
                        {
                          "ScalingChecknr": "7"
                        },
                        {
                          "ScalingChecknr": "8"
                        },
                        {
                          "ScalingChecknr": "9"
                        },
                        {
                          "ScalingChecknr": "10"
                        },
                        {
                          "ScalingChecknr": "11"
                        },
                        {
                          "ScalingChecknr": "12"
                        },
                        {
                          "ScalingChecknr": "13"
                        },
                        {
                          "ScalingChecknr": "14"
                        },
                        {
                          "ScalingChecknr": "15"
                        },
                        {
                          "ScalingChecknr": "16"
                        },
                        {
                          "ScalingChecknr": "17"
                        },
                        {
                          "ScalingChecknr": "18"
                        },
                        {
                          "ScalingChecknr": "19"
                        },
                        {
                          "ScalingChecknr": "20"
                        },
                        {
                          "ScalingChecknr": "21"
                        },
                        {
                          "ScalingChecknr": "22"
                        },
                        {
                          "ScalingChecknr": "23"
                        },
                        {
                          "ScalingChecknr": "24"
                        }
                      ],
                      "sample": {
                        "mode": "sequential"
                      },
                      "files": {},
                      "responses": {},
                      "parameters": {},
                      "messageHandlers": {},
                      "title": "Scaling loop",
                      "shuffleGroups": [],
                      "template": {
                        "type": "lab.flow.Sequence",
                        "files": {},
                        "responses": {},
                        "parameters": {},
                        "messageHandlers": {},
                        "title": "Scaling sequence 2",
                        "tardy": true,
                        "skip": "${this.state.scaling_check == \"yes\"}",
                        "content": [
                          {
                            "type": "lab.html.Form",
                            "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\n  \u003Cdiv\u003E\n    \u003Cstyle type=\"text\u002Fcss\"\u003E\n      #credit_card line {\n        stroke: var(--color-border);\n        stroke-dasharray: 4;\n        vector-effect: non-scaling-stroke;\n      }\n      #credit_card rect {\n        fill: var(--color-gray-background);\n        stroke: var(--color-border);\n        stroke-width: 2;\n        stroke-linecap: butt;\n        stroke-linejoin: round;\n        vector-effect: non-scaling-stroke;\n      }\n      #credit_card rect.background {\n        fill: white;\n        stroke: lightblue;\n        stroke-width: 10;\n      }\n    \u003C\u002Fstyle\u003E\n    \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" version=\"1.1\"\n      viewBox=\"-400 -250 800 500\" \n      style=\"width: 800px; height: 500px\"\u003E \n      \u003C!-- viewBox=\"-400 -216 800 432\"  style=\"width: 800px; height: 432\" --\u003E\n      \u003Cg\n        id=\"credit_card\"\n        transform=\"scale(1)\"\n      \u003E\n        \u003Cline x1=\"-168.75\" y1=\"-2000\" x2=\"-168.75\" y2=\"2000\" \u002F\u003E\n        \u003Cline x1=\"168.75\" y1=\"-2000\" x2=\"168.75\" y2=\"2000\" \u002F\u003E\n        \u003Cline x1=\"-2000\" y1=\"-106.25\" x2=\"2000\" y2=\"-106.25\" \u002F\u003E\n        \u003Cline x1=\"-2000\" y1=\"106.25\" x2=\"2000\" y2=\"106.25\" \u002F\u003E\n        \u003Crect\n          class=\"background\"\n          x=\"-168.75\" y=\"-106.25\"\n          width=\"337.5\" height=\"212.5\"\n          rx=\"12.5\"\n        \u002F\u003E\n        \u003Crect\n          class=\"card\"\n          x=\"-168.75\" y=\"-106.25\"\n          width=\"337.5\" height=\"212.5\"\n          rx=\"12.5\"\n        \u002F\u003E\n      \u003C\u002Fg\u003E\n    \u003C\u002Fsvg\u003E\n    \u003Cdiv class=\"m-l\" \u003E\n      \u003Cp class=\"font-weight-bold content-horizontal-center\"\u003E\n        Please adjust the size of the rectangle to the size of a credit card as accurately as possible.\n      \u003C\u002Fp\u003E\n      \u003Cform id=\"pumps-form\"\u003E\n        \u003Cinput \n          type=\"range\" \n          name=\"scale\" id=\"scale\"\n          class=\"w-100\"\n          min=\"20\" max=\"200\" value = \"100\" required\n        \u003E\n      \n        \u003Cbr\u003E\n        \u003Cp class=\"font-weight-bold content-horizontal-left\"\u003E\n        \u003Clabel for=\"scaling_quest\"\u003EPlease confirm one of the following statements by checking the box.\u003C\u002Flabel\u003E\n        \u003C\u002Fp\u003E\n        \u003Ctable\u003E\n          \u003Ctr \u003E\n          \u003Cth style=\"text-align:right\"\u003E\n            \u003Cinput type=\"radio\" name=\"scaling_quest\" id=\"radio-button-scaling_quest-yes\" value=\"I have successfully resized the rectangle to the size of a credit card.\" required\u003E\n          \u003C\u002Fth\u003E\n          \u003Ctd style=\"text-align:left\"\u003E\n            \u003Clabel for=\"radio-button-scaling_quest-yes\"\u003EI have successfully resized the rectangle to fit the size of a credit card.\u003C\u002Flabel\u003E\n          \u003C\u002Ftd\u003E\n        \u003C\u002Ftr\u003E\n        \u003Ctr\u003E\n          \u003Cth style=\"text-align:right\"\u003E\n            \u003Cinput type=\"radio\" name=\"scaling_quest\" id=\"radio-button-scaling_quest-no\" value=\"I didn't succeed, even though I tried to resize the rectangle to the size of a credit card.\" required\u003E\n          \u003C\u002Fth\u003E\n          \u003Ctd style=\"text-align:left\"\u003E\n            \u003Clabel for=\"radio-button-scaling_quest-no\"\u003EI didn't succeed, even though I tried to make the size of the rectangle fit the size of a credit card.\u003C\u002Flabel\u003E\n          \u003C\u002Ftd\u003E\n          \u003C\u002Ftr\u003E\n           \n       \u003C\u002Ftable\u003E\n      \u003C\u002Fform\u003E\n    \n  \u003C\u002Fdiv\u003E\n\u003C\u002Fmain\u003E\n\n  \u003Cfooter\u003E\n  \u003Cbutton type=\"submit\" form=\"pumps-form\"\u003E Next→ \u003C\u002Fbutton\u003E\n  \u003C\u002Ffooter\u003E",
                            "scrollTop": true,
                            "files": {},
                            "responses": {},
                            "parameters": {},
                            "messageHandlers": {
                              "before:prepare": function anonymous(
) {
this.options.events['input input'] = function() {
  const scale = document.getElementById('scale').value
  document.getElementById('credit_card')
    .setAttribute(
      'transform',
      `scale(${ scale / 100 })`
    )
}
},
                              "end": function anonymous(
) {
// Get the image width and height in browser pixels
const { width, height } = document.querySelector('svg #credit_card rect.card')
  .getBoundingClientRect()

// Compute dpi and dpcm based on this information
this.data.dpi = width / 3.37 // 3.375 //  
this.data.dpcm = width / 8.56 // 8.573 // 
}
                            },
                            "title": "Scaling form"
                          },
                          {
                            "type": "lab.html.Form",
                            "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\n  \u003Cdiv\u003E\n    \u003Cstyle type=\"text\u002Fcss\"\u003E\n      #credit_card line {\n        stroke: var(--color-border);\n        stroke-dasharray: 4;\n        vector-effect: non-scaling-stroke;\n      }\n      #credit_card rect {\n        fill: var(--color-gray-background);\n        stroke: var(--color-border);\n        stroke-width: 2;\n        stroke-linecap: butt;\n        stroke-linejoin: round;\n        vector-effect: non-scaling-stroke;\n      }\n      #credit_card rect.background {\n        fill: white;\n        stroke: lightblue;\n        stroke-width: 10;\n      }\n    \u003C\u002Fstyle\u003E\n    \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" version=\"1.1\"\n      viewBox=\"-400 -250 800 500\" \n      style=\"width: 800px; height: 500\"\u003E \n      \u003Cg\n        id=\"credit_card\"\n        transform=\"scale(1)\"\n      \u003E\n        \u003Cline x1=\"-${this.parameters.scaling_rectx}\" y1=\"-2000\" x2=\"-${this.parameters.scaling_rectx}\" y2=\"2000\" \u002F\u003E\n        \u003Cline x1=\"${this.parameters.scaling_rectx}\" y1=\"-2000\" x2=\"${this.parameters.scaling_rectx}\" y2=\"2000\" \u002F\u003E\n        \u003Cline x1=\"-2000\" y1=\"-${this.parameters.scaling_recty}\" x2=\"2000\" y2=\"-${this.parameters.scaling_recty}\" \u002F\u003E\n        \u003Cline x1=\"-2000\" y1=\"${this.parameters.scaling_recty}\" x2=\"2000\" y2=\"${this.parameters.scaling_recty}\" \u002F\u003E\n        \u003Crect\n          class=\"background\"\n          x=\"-${this.parameters.scaling_rectx}\" y=\"-${this.parameters.scaling_recty}\"\n          width=\"${this.parameters.scaling_rectwidth}\" height=\"${this.parameters.scaling_rectheight}\"\n          rx=\"12.5\"\n        \u002F\u003E\n        \u003Crect\n          class=\"card\"\n          x=\"-${this.parameters.scaling_rectx}\" y=\"-${this.parameters.scaling_recty}\"\n          width=\"${this.parameters.scaling_rectwidth}\" height=\"${this.parameters.scaling_rectheight}\"\n          rx=\"12.5\"\n        \u002F\u003E\n      \u003C\u002Fg\u003E\n    \u003C\u002Fsvg\u003E\n    \u003Cform id=\"myForm\"\u003E\n      \u003Cdiv class=\"m-l font-weight-bold\" \u003E\n      \u003Clabel for=\"scaling_check\"\u003EYou have entered the following size. Is this correct?\u003C\u002Flabel\u003E\n      \u003C\u002Fdiv\u003E\n      \u003Ctable class=\"content-horizontal-center\" \u003E\n          \u003Ctr \u003E\n            \u003Cth style=\"text-align:right\"\u003E\n              \u003Cinput type=\"radio\" name=\"scaling_check\" id=\"scaling_check-yes\" value=\"yes\" required\u003E\n            \u003C\u002Fth\u003E\n          \n            \u003Ctd style=\"text-align:left\"\u003E\n              \u003Clabel for=\"scaling_check-yes\"\u003EYes\u003C\u002Flabel\u003E\u003Cbr\u003E\n            \u003C\u002Ftd\u003E\n         \n          \u003C\u002Ftr\u003E\n          \u003Ctr\u003E\n\n            \u003Cth style=\"text-align:right\"\u003E\n              \u003Cinput type=\"radio\" name=\"scaling_check\" id=\"scaling_check-no\" value=\"no\" required\u003E\n            \u003C\u002Fth\u003E\n\n            \u003Ctd style=\"text-align:left\"\u003E\n              \u003Clabel for=\"scaling_check-no\"\u003ENo\u003C\u002Flabel\u003E\u003Cbr\u003E\n            \u003C\u002Ftd\u003E\n\n            \u003C\u002Ftr\u003E\n        \u003C\u002Ftable\u003E\n    \u003C\u002Fform\u003E\n  \u003C\u002Fdiv\u003E\n\u003C\u002Fmain\u003E\n\n  \u003Cfooter\u003E\n  \u003Cbutton type=\"submit\" form=\"myForm\"\u003E Next→ \u003C\u002Fbutton\u003E\n  \u003C\u002Ffooter\u003E\n",
                            "scrollTop": true,
                            "files": {},
                            "responses": {},
                            "parameters": {},
                            "messageHandlers": {
                              "before:prepare": function anonymous(
) {
this.parameters.scaling_rectwidth = 337.5*(this.state.dpi/100)
this.parameters.scaling_rectheight = 212.5*(this.state.dpi/100)
this.parameters.scaling_rectx = this.parameters.scaling_rectwidth/2
this.parameters.scaling_recty = this.parameters.scaling_rectheight/2

window.scaling_rectx = this.parameters.scaling_rectx
window.scaling_recty = this.parameters.scaling_recty


}
                            },
                            "title": "Scaling check form",
                            "tardy": true,
                            "skip": "${this.state.scaling_quest != \"I have successfully resized the rectangle to the size of a credit card.\"}"
                          },
                          {
                            "type": "lab.html.Screen",
                            "files": {},
                            "responses": {},
                            "parameters": {},
                            "messageHandlers": {
                              "before:prepare": function anonymous(
) {
this.options.events['click'] = function() {

  lab.util.fullscreen.exit(document.body)

}
}
                            },
                            "title": "Scaling end",
                            "content": "\u003Cheader\u003E\n  \u003Ch2\u003EDue to a problem with the adjustment to the size of a credit card, the session has ended.\u003C\u002Fh2\u003E\n\u003C\u002Fheader\u003E\n\n\u003Cfooter\u003E\n  \u003Ctable class=\"table-plain\"\u003E\n    \u003Ctr\u003E\n      \u003Ctd id=\"done\"\u003E\n        Click \u003Cb\u003Ehere\u003C\u002Fb\u003E to exit full screen mode. You can then close the window.\n      \u003C\u002Ftd\u003E\n    \u003C\u002Ftr\u003E\n  \u003C\u002Ftable\u003E\n\u003C\u002Ffooter\u003E",
                            "tardy": true,
                            "skip": "${this.state.scaling_quest == \"I have successfully resized the rectangle to the size of a credit card.\"}"
                          }
                        ]
                      }
                    }
                  ]
                }
              ]
            },
            {
              "type": "lab.flow.Sequence",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Colourblindness_Sequence",
              "skip": "${this.state['group']==='synaesthete'}",
              "tardy": true,
              "content": [
                {
                  "type": "lab.html.Page",
                  "items": [
                    {
                      "type": "text",
                      "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\n\u003Ccons class=\"text-left\" \u003E\n\n \u003Cheader\u003E\u003Ch1\u003EColour Blindness Checks \u003C\u002Fh1\u003E\u003C\u002Fheader\u003E"
                    }
                  ],
                  "scrollTop": true,
                  "submitButtonText": "Next→",
                  "submitButtonPosition": "right",
                  "files": {
                    "colourblindness.png": "embedded\u002F4a2e09d6130e34cc0432a99453d6f6bbc616323a0572e065634152870e9b3729.png"
                  },
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Colourblindess_Title"
                },
                {
                  "type": "lab.html.Page",
                  "items": [
                    {
                      "type": "text",
                      "content": "\u003Cheader\u003E \u003Ch1\u003E Colour Vision Test 1 \u003Ch1\u003E \u003C\u002Fheader\u003E"
                    },
                    {
                      "required": true,
                      "type": "text",
                      "content": "You will now be shown some coloured circles. In these circles, a number will usually be displayed. Please write the displayed number in the box below the circle.  "
                    },
                    {
                      "required": true,
                      "type": "text",
                      "content": "The circles will look like this. In this example you should be able to see the number \"12\" in the middle.\nEven if you are unsure, please always enter a number. "
                    },
                    {
                      "required": true,
                      "type": "html",
                      "content": "\r\n  \u003Cdiv style=\"margin-bottom: 20px; display: flex; justify-content: center;\"\u003E\r\n    \u003Cimg id=\"ishihara\" src=\"${this.files[\"Ishihara_Example_Small.jpg\"]}\" alt=\"Ishihara Example\"\u003E\r\n\u003C\u002Fdiv\u003E",
                      "name": ""
                    }
                  ],
                  "scrollTop": true,
                  "submitButtonText": "Next→",
                  "submitButtonPosition": "right",
                  "files": {
                    "Ishihara_Example_Small.jpg": "embedded\u002F4d2743b19e6259218c7fef588bd77222a3cc565498d8229055cf3fce7958bdec.jpg"
                  },
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {
                    "before:prepare": function anonymous(
) {
// Function to disable scrolling
function disableScrolling(element) {
  element.style.overflow = 'hidden';
}

// Disable scrolling on the body element
disableScrolling(document.body);


}
                  },
                  "title": "Ishihara_Test_Intro",
                  "width": "l"
                },
                {
                  "type": "lab.flow.Loop",
                  "templateParameters": [
                    {
                      "ishihara_image": "Ishihara-Plate-03.jpg",
                      "correct_response": "6"
                    },
                    {
                      "ishihara_image": "Ishihara-Plate-04.jpg",
                      "correct_response": "29"
                    },
                    {
                      "ishihara_image": "Ishihara-Plate-05.jpg",
                      "correct_response": "57"
                    },
                    {
                      "ishihara_image": "Ishihara-Plate-06.jpg",
                      "correct_response": "5"
                    },
                    {
                      "ishihara_image": "Ishihara-Plate-07.jpg",
                      "correct_response": "3"
                    },
                    {
                      "ishihara_image": "Ishihara-Plate-08.jpg",
                      "correct_response": "15"
                    },
                    {
                      "ishihara_image": "Ishihara-Plate-09.jpg",
                      "correct_response": "74"
                    },
                    {
                      "ishihara_image": "Ishihara-Plate-10.jpg",
                      "correct_response": "2"
                    },
                    {
                      "ishihara_image": "Ishihara-Plate-11.jpg",
                      "correct_response": "6"
                    },
                    {
                      "ishihara_image": "Ishihara-Plate-12.jpg",
                      "correct_response": "97"
                    },
                    {
                      "ishihara_image": "Ishihara-Plate-13.jpg",
                      "correct_response": "45"
                    },
                    {
                      "ishihara_image": "Ishihara-Plate-14.jpg",
                      "correct_response": "5"
                    },
                    {
                      "ishihara_image": "Ishihara-Plate-15.jpg",
                      "correct_response": "7"
                    },
                    {
                      "ishihara_image": "Ishihara-Plate-16.jpg",
                      "correct_response": "16"
                    },
                    {
                      "ishihara_image": "Ishihara-Plate-17.jpg",
                      "correct_response": "73"
                    },
                    {
                      "ishihara_image": "Ishihara-Plate-02.jpg",
                      "correct_response": "8"
                    }
                  ],
                  "sample": {
                    "mode": "draw-shuffle",
                    "n": ""
                  },
                  "files": {
                    "Ishihara-Plate-02.jpg": "embedded\u002F334477227c6d6d8c69fd4b2ab110b14b7bc3235b030cfaf8bf005f58b905301b.jpg",
                    "Ishihara-Plate-03.jpg": "embedded\u002F44dd3171d5480fac90590fa6caf5336f034d060f0b0ce0f9a5221eca88671dbc.jpg",
                    "Ishihara-Plate-04.jpg": "embedded\u002F14657096df72a266c3ebe0c566c9bbd03e30d194b40c39e12b3daef713945872.jpg",
                    "Ishihara-Plate-05.jpg": "embedded\u002F2e36cc7cb0195b452af06266fe72e8f2be498164f6c7a11bf137ab01c6bed352.jpg",
                    "Ishihara-Plate-06.jpg": "embedded\u002Fb159e7c0847e9d2af08f8bcb6f21ffc75c38995327fd624887787b86f2c22485.jpg",
                    "Ishihara-Plate-07.jpg": "embedded\u002F9812f97e93cd0b3815f31a6b2c1ca11f9d562d136b653f5537d33ca5213d06b0.jpg",
                    "Ishihara-Plate-08.jpg": "embedded\u002F42576e3864a80230df80efb25f09a896a2e436deda88b1135562aab72c1b5ac4.jpg",
                    "Ishihara-Plate-09.jpg": "embedded\u002F139f3f69eb5d6a133f31cd443ceb3b952e38e6ffb98ea64c2a35465d96e58f6f.jpg",
                    "Ishihara-Plate-10.jpg": "embedded\u002Fc8f56c94aaa289be36506da3196431017c970a0e1a5da0674fb233dfc1b48b7b.jpg",
                    "Ishihara-Plate-11.jpg": "embedded\u002Fdcf0ff541466ae0a71047e1312ff23a7e9a138170eb794e62acef77bdf8c98ce.jpg",
                    "Ishihara-Plate-12.jpg": "embedded\u002Fb66f8a29d73a4e14d26ef14b8109b417998b06fab38353a7bb85b0e474077777.jpg",
                    "Ishihara-Plate-13.jpg": "embedded\u002F0173d3bbd3ad6cf11c74f5b4fd3377dba8a3c441680e60723a8a9377f1a1f9d9.jpg",
                    "Ishihara-Plate-14.jpg": "embedded\u002Fd81048ab3722ea5a93d989243458a31fa1baab3072e2fd0e049ba6cd5d15f31e.jpg",
                    "Ishihara-Plate-15.jpg": "embedded\u002F3d2f3e068959aab8c90a97a97246b83f6cbf53c71eb17b1673ce9d434f121dfd.jpg",
                    "Ishihara-Plate-16.jpg": "embedded\u002F33f2d141a5b26ba71a302e8676d06c4e8b02d9539891b17cc5aa612e0e20a5e8.jpg",
                    "Ishihara-Plate-17.jpg": "embedded\u002F00b2d83e16c0cb5a73d0718162cc5714a958c5b88337134037b1dfdb9bbaeade.jpg",
                    "Ishihara-Plate-18.jpg": "embedded\u002F5a0c6c29491b0c0c8d952f89f605fcb7f4b90c5d8818192ecf04bc000d84e057.jpg",
                    "Ishihara-Plate-19.jpg": "embedded\u002F78067d90d8f9be1004ffeeaceafd8ed503b84846bd41b9f68673f39a2145142e.jpg",
                    "Ishihara-Plate-20.jpg": "embedded\u002Fad0f027cbc0b4cb669e2ac076003620c82961f8fdb2818742e561d19454a2a03.jpg",
                    "Ishihara-Plate-21.jpg": "embedded\u002F8afe42fb1eb1c9eab86e6ed84bdc329e1430587f65f27fd2a20042910b44c797.jpg"
                  },
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Ishihara_Test",
                  "tardy": true,
                  "correctResponse": "${this.parameters.correct_response}",
                  "shuffleGroups": [],
                  "template": {
                    "type": "lab.html.Form",
                    "content": "\u003Cstyle\u003E\n  main {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 100vh; \u002F* Set the height to 100% of the viewport height *\u002F\n  }\n\n  form {\n    text-align: center;\n  }\n\u003C\u002Fstyle\u003E\n\n\u003Cmain\u003E\n  \u003Cform\u003E\n    \u003Cdiv\u003E\n      \u003Cimg class=\"plate\" id=\"plate_color\" src=\"${this.files[this.parameters.ishihara_image]}\" alt=\"Ishihara_plate\" \u002F\u003E\n    \u003C\u002Fdiv\u003E\n    \u003Clabel for=\"Number\"\u003EPlease enter the number you see:\u003C\u002Flabel\u003E\u003Cbr\u003E\n    \u003Cinput name=\"Number\" id=\"numberInput\" pattern=\"[0-9]+\" required oninput=\"document.getElementById('submitButton').disabled = !this.validity.valid\" autocomplete=\"off\"\u003E\n    \u003Cbutton type=\"submit\" id=\"submitButton\" disabled\u003ESubmit\u003C\u002Fbutton\u003E\n  \u003C\u002Fform\u003E\n\u003C\u002Fmain\u003E\n",
                    "scrollTop": true,
                    "files": {},
                    "responses": {},
                    "parameters": {},
                    "messageHandlers": {
                      "run": function anonymous(
) {
// This will scale the image to the set value from the scaling task *.010
plate_color.style.width = window.scaling_rectx*0.010*230+"px";

}
                    },
                    "title": "Ishihara_Display"
                  }
                },
                {
                  "type": "lab.html.Screen",
                  "files": {},
                  "responses": {
                    "click button": "continue"
                  },
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
const ishihara_data = this.options.datastore.data.filter(
  row => row.sender === 'Ishihara_Display' &&
          row.ended_on !== 'skipped'
);

const ishihara_score = ishihara_data.reduce((score, row) => {
  // Assuming 'Number' and 'correct_response' are properties of the objects
  if (row.Number === row.correct_response) {
    return score + 1;
  } else {
    return score + 0;
  }
}, 0);

this.data.ishihara_score = ishihara_score;
const isColourBlind = ishihara_score < 13;

// Options
if (!isColourBlind) {
    document.getElementById('messageColourblind').innerHTML = "<p> Great! </p> <p>This test (the Ishihara Test) indicates that you do not experience red/green colourblindness. Please take a short break before we move on to the next colour blindness test. </p> <p> Click 'Next' when you are ready to move on. </p>";
} else {
    document.getElementById('messageNotColourblind').innerHTML = "<p> Thanks!</p> <p> Unfortunately, the results of this test (the Ishihara Test) indicate that you may experience a form of colour blindness. We recommend speaking to your doctor or an optometrist about this result. You will not be able to participate in this research and will soon be taken to an end screen. </p> <p> Click 'Next' to move on.</p>";
}

}
                  },
                  "title": "Ishihara_Results_Screen",
                  "content": "\u003Cmain class=\"centered-container\"\u003E\r\n  \u003Cdiv class=\"message\"\u003E\r\n    \u003Cdiv\u003E\r\n      \u003Cspan id=\"messageColourblind\"\u003E\u003C\u002Fspan\u003E\r\n      \u003Cspan id=\"messageNotColourblind\"\u003E\u003C\u002Fspan\u003E\r\n    \u003C\u002Fdiv\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n  \u003Cbutton id=\"buttonSubmit\"\u003ENext→\u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E\r\n",
                  "tardy": true
                },
                {
                  "type": "lab.html.Screen",
                  "files": {
                    "Pier_art.jpg": "embedded\u002F36767d154b4ecd1616fffb8367233dc3694fe53b2257f68a0260df62e590f82d.jpg"
                  },
                  "parameters": {},
                  "responses": {},
                  "messageHandlers": {
                    "before:prepare": function anonymous(
) {
this.options.events['click'] = function() {

  lab.util.fullscreen.exit(document.body)

}
}
                  },
                  "title": "Colourblind_End",
                  "content": "\u003Cheader\u003E\r\n  \u003Ch2\u003EThe session has ended.\u003C\u002Fh2\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Ch3 style=\"text-align: center; color: red;\"\u003EPlease click on this link to confirm your participation and return to the Prolific website:\u003C\u002Fh3\u003E\r\n\u003Cp style=\"text-align: center; font-size: 20;\"\u003E\u003Ca href=\"https:\u002F\u002Fapp.prolific.com\u002Fsubmissions\u002Fcomplete?cc=C3ILQ3H5\"\u003Ehttps:\u002F\u002Fapp.prolific.com\u002Fsubmissions\u002Fcomplete?cc=C3ILQ3H5\u003C\u002Fa\u003E\u003C\u002Fp\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n  \u003Csection class=\"w-l text-justify\"\u003E\r\n    \u003Cimg src=\"${ this.files[\"Pier_art.jpg\"] }\" width=\"700\"\u003E \u003C\u002Fimg\u003E\r\n    \u003Cfigcaption style=\"font-size:11px\"\u003EM Bleichner: Good Old Brighton Pier\u003C\u002Ffigcaption\u003E\r\n  \u003C\u002Fsection\u003E\r\n\u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n  \u003Ctable class=\"table-plain\"\u003E\r\n    \u003Ctr\u003E\r\n      \u003Ctd id=\"done\"\u003E\r\n        Click \u003Cb\u003Ehere\u003C\u002Fb\u003E to exit full screen mode. You can then close the window.\r\n      \u003C\u002Ftd\u003E\r\n    \u003C\u002Ftr\u003E\r\n  \u003C\u002Ftable\u003E\r\n\u003C\u002Ffooter\u003E",
                  "skip": "${this.state.ishihara_score \u003E= 14}",
                  "tardy": true
                },
                {
                  "type": "lab.html.Page",
                  "items": [
                    {
                      "required": true,
                      "type": "html",
                      "content": "\u003Cheader\u003E \u003Ch1\u003E Colour Vision Test 2 \u003Ch1\u003E \u003C\u002Fheader\u003E",
                      "name": ""
                    },
                    {
                      "required": true,
                      "type": "text",
                      "title": "",
                      "content": "Arrange the colours so that there are as small as possible colour differences between adjacent colours. The colours can be rearranged at any time."
                    },
                    {
                      "required": true,
                      "type": "text",
                      "content": ""
                    },
                    {
                      "required": true,
                      "type": "text",
                      "content": "\u003Ccenter\u003E\n\u003Cembed type=\"text\u002Fhtml\" src=\"https:\u002F\u002Fwww.colour-blindness.com\u002FCBTests\u002Fcat\u002Fcat.html\" width=\"600\" height=\"250\"\u003E \n\u003C\u002Fcenter\u003E\n\n",
                      "title": ""
                    },
                    {
                      "required": true,
                      "type": "radio",
                      "label": "Enter the result of the colour vision test here.",
                      "options": [
                        {
                          "label": "Not colourblind (normal colour vision)",
                          "coding": "0"
                        },
                        {
                          "label": "Protan colour vision defect (abnormal colour vision)",
                          "coding": "1"
                        },
                        {
                          "coding": "2",
                          "label": "Something else"
                        }
                      ],
                      "name": "colorvision"
                    }
                  ],
                  "scrollTop": true,
                  "submitButtonText": "Next→",
                  "submitButtonPosition": "right",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Farnsworth_Test",
                  "width": "l"
                },
                {
                  "type": "lab.html.Screen",
                  "files": {
                    "Pier_art.jpg": "embedded\u002F36767d154b4ecd1616fffb8367233dc3694fe53b2257f68a0260df62e590f82d.jpg"
                  },
                  "parameters": {},
                  "responses": {},
                  "messageHandlers": {
                    "before:prepare": function anonymous(
) {
this.options.events['click'] = function() {

  lab.util.fullscreen.exit(document.body)

}
}
                  },
                  "title": "Colourblind_End",
                  "content": "\u003Cheader\u003E\r\n  \u003Ch2\u003EThe session has ended.\u003C\u002Fh2\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Ch3 style=\"text-align: center; color: red;\"\u003EPlease click on this link to confirm your participation and return to the Prolific website:\u003C\u002Fh3\u003E\r\n\u003Cp style=\"text-align: center; font-size: 20;\"\u003E\u003Ca href=\"https:\u002F\u002Fapp.prolific.com\u002Fsubmissions\u002Fcomplete?cc=C3ILQ3H5\"\u003Ehttps:\u002F\u002Fapp.prolific.com\u002Fsubmissions\u002Fcomplete?cc=C3ILQ3H5\u003C\u002Fa\u003E\u003C\u002Fp\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n  \u003Csection class=\"w-l text-justify\"\u003E\r\n    \u003Cimg src=\"${ this.files[\"Pier_art.jpg\"] }\" width=\"700\"\u003E \u003C\u002Fimg\u003E\r\n    \u003Cfigcaption style=\"font-size:11px\"\u003EM Bleichner: Good Old Brighton Pier\u003C\u002Ffigcaption\u003E\r\n  \u003C\u002Fsection\u003E\r\n\u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n  \u003Ctable class=\"table-plain\"\u003E\r\n    \u003Ctr\u003E\r\n      \u003Ctd id=\"done\"\u003E\r\n        Click \u003Cb\u003Ehere\u003C\u002Fb\u003E to exit full screen mode. You can then close the window.\r\n      \u003C\u002Ftd\u003E\r\n    \u003C\u002Ftr\u003E\r\n  \u003C\u002Ftable\u003E\r\n\u003C\u002Ffooter\u003E",
                  "skip": "${this.state.colorvision == 0}",
                  "tardy": true
                }
              ]
            }
          ]
        },
        {
          "type": "lab.flow.Sequence",
          "files": {},
          "responses": {},
          "parameters": {},
          "messageHandlers": {},
          "title": "Synaesthesia_Intro",
          "content": [
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "type": "text",
                  "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\n\u003Ccons class=\"text-left\" \u003E\n\n \u003Cheader\u003E\u003Ch1\u003ESynaesthesia Checks \u003C\u002Fh1\u003E\u003C\u002Fheader\u003E"
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {
                "colourblindness.png": "embedded\u002F4a2e09d6130e34cc0432a99453d6f6bbc616323a0572e065634152870e9b3729.png"
              },
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Synaesthesia_Title"
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "type": "text",
                  "content": "\u003Cheader\u003E\n  \u003Ch1 id=\"welcomeHeader\"\u003EWhat is synaesthesia?\u003C\u002Fh1\u003E\n\u003C\u002Fheader\u003E\n\n\u003Cp class = \"alert alter-warning\" \u003E People with synaesthesia experience a ‘mixing of the senses’: tastes may have shapes, or written text may evoke experiences of vivid colours. \n\u003Cbr\u003E\u003Cbr\u003E \u003Cb\u003E It is a rare perceptual trait, experienced by around 4% of the population. \u003C\u002Fb\u003E \u003Cbr\u003E\u003Cbr\u003E\nThe two most common types are words\u002Fletters having colour when for most people they would appear to be black, and sequences (like days of the week) appearing at specific points in space. Below are some pictures showing examples of synaesthesia.   \u003C\u002Fp\u003E"
                },
                {
                  "required": true,
                  "type": "image",
                  "src": "${ this.files[\"examples of syn.jpg\"] }",
                  "width": "2500",
                  "name": ""
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {
                "": "embedded\u002F2ea69437b07895f113c3ab91b8c424a235797cb445d006e276d7043effe58992.jpg",
                "examples of syn.jpg": "embedded\u002F2a9455a3d64896845933da98ddc57fdc0cb316789c04888f99c520c8b51aafaf.jpg"
              },
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Syn_Description",
              "width": "l",
              "tardy": true
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Cheader\u003E\r\n  \u003Ch1 id=\"welcomeHeader\"\u003EDo you think that you have synaesthesia?\u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E\r\n",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "radio",
                  "options": [
                    {
                      "label": "I am sure I do \u003Cb\u003ENOT\u003C\u002Fb\u003E  have it",
                      "coding": "syn_no"
                    },
                    {
                      "label": "Unsure",
                      "coding": "syn_unsure"
                    },
                    {
                      "label": "I am sure I \u003Cb\u003EDO\u003C\u002Fb\u003E have it",
                      "coding": "syn_yes"
                    }
                  ],
                  "label": "Please select an answer:",
                  "name": "syn_self_identified"
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Syn_initial_indication",
              "tardy": true
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Cheader\u003E\r\n  \u003Ch1 id=\"welcomeHeader\"\u003EGreat! Thanks for letting us know.\u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Cp\u003E We will now test for the two main types of synaesthesia.\r\n\u003Cbr\u003E \u003Cbr\u003E\r\nThe first one looks at language to colour experiences. For a small number of people, letters and number are linked to definite and specific colours and this has been the case for as long as they remember. \r\n\u003Cbr\u003E\r\n\u003Cp  class = \"alert alter-warning\"\u003E The majority of people don’t have any definite and specific colour associations to letters and numbers and it is ok to click ‘no colour’ as many times as you like during the test, provided that is your true answer.\r\n\r\n",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "divider"
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Syn_initial_thanks",
              "tardy": true
            }
          ]
        },
        {
          "type": "lab.flow.Sequence",
          "files": {},
          "responses": {},
          "parameters": {},
          "messageHandlers": {},
          "title": "Consistency_Tests",
          "tardy": true,
          "content": [
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "type": "text",
                  "content": "The first synaesthesia test will start on the next page. You will see \u003Ci\u003E numbers and\u002For letters \u003C\u002Fi\u003E on the screen next to a colour palette. Choose the best colour for each \u003Ci\u003E number or letter. \u003C\u002Fi\u003E You can choose any colours you like, but please don't pick the same colour for everything. Be as fast as you can. \n\u003Cbr\u003E\n\u003Cbr\u003E\nHere’s how to choose a colour. First click the vertical colour-bar to pick the kind of colour you want. Then pick the shade by clicking on the shade-box. Black, white and grey are at the edges of the shade-box. Your colour is shown in the large rectangle.\n\u003Cbr\u003E\n\u003Cbr\u003E\n\u003Cb style=\"color: red;\"\u003EIMPORTANT: If you do not naturally associate the number or letter with a colour, please click the \"No Colour\" button\u003C\u002Fb\u003E\n\u003Cbr\u003E\n\u003Cbr\u003E\nThe test is quite repetitive but thanks for your patience! You will be able to see your progress as you go through the test.\n\u003Cbr\u003E\n\u003Cbr\u003E",
                  "title": "\u003Cp style=\"font-size: 2em; text-align: center;\"\u003ESynaesthesia Test 1\u003C\u002Fp\u003E"
                },
                {
                  "required": true,
                  "type": "divider"
                },
                {
                  "required": true,
                  "type": "image",
                  "src": "${ this.files[\"GC consistency test screenshot.png\"] }",
                  "name": ""
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {
                "GC consistency test screenshot.png": "embedded\u002F9b233eeed7d9046ab203038e4ff1446341aff8fdc49d49b7c1bc9987a3186b40.png"
              },
              "responses": {},
              "parameters": {},
              "messageHandlers": {
                "before:prepare": function anonymous(
) {
// Function to enable scrolling in full-screen mode
function enableScrollingInFullscreen(element) {
  element.style.overflow = 'auto';
}

// Enable scrolling on the body element
enableScrollingInFullscreen(document.body);
}
              },
              "title": "Language_colour_intro",
              "width": "l"
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "type": "text",
                  "content": "If you \u003Cb\u003E DO \u003C\u002Fb\u003E have definite and specific colour associations to letters and numbers then visualise these and select the best colour. \u003Cbr\u003E\u003Cbr\u003E\n\n\u003Cp class = alert alert-warning\u003E If, like the majority of people, you don’t do this then please \u003Cb\u003E press the \"no colour\" button to skip. \u003C\u002Fb\u003E \u003C\u002Fp\u003E\n\u003Cbr\u003E\n\n",
                  "title": "\u003Cheader\u003E   \u003Ch1 id=\"welcomeHeader\"\u003ERemember\u003C\u002Fh1\u003E \u003C\u002Fheader\u003E"
                },
                {
                  "required": true,
                  "type": "divider"
                },
                {
                  "required": true,
                  "type": "radio",
                  "label": "Please click ‘I understand’ to move to the next screen",
                  "options": [
                    {
                      "label": "I understand",
                      "coding": "1"
                    },
                    {
                      "label": "I do not understand",
                      "coding": "0"
                    }
                  ],
                  "name": "GC_begin"
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "GC_attention_check",
              "tardy": true
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "type": "text",
                  "title": "\u003Cheader\u003E   \u003Ch1 id=\"welcomeHeader\"\u003EThat's okay!\u003C\u002Fh1\u003E \u003C\u002Fheader\u003E",
                  "content": "Please carefully review the instructions again, then select \"I understand\"."
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Review_message",
              "tardy": true,
              "skip": "${this.state.GC_begin != 0}"
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "type": "text",
                  "content": "The first synaesthesia test will start on the next page. You will see \u003Ci\u003E numbers and\u002For letters \u003C\u002Fi\u003E on the screen next to a colour palette. Choose the best colour for each \u003Ci\u003E number or letter. \u003C\u002Fi\u003E You can choose any colours you like, but please don't pick the same colour for everything. Be as fast as you can. \n\u003Cbr\u003E\n\u003Cbr\u003E\nHere’s how to choose a colour. First click the vertical colour-bar to pick the kind of colour you want. Then pick the shade by clicking on the shade-box. Black, white and grey are at the edges of the shade-box. Your colour is shown in the large rectangle.\n\u003Cbr\u003E\n\u003Cbr\u003E\n\u003Cb style=\"color: red;\"\u003EIMPORTANT: If you do not naturally associate the number or letter with a colour, please click the \"No Colour\" button\u003C\u002Fb\u003E\n\u003Cbr\u003E\n\u003Cbr\u003E\nThe test is quite repetitive but thanks for your patience! You will be able to see your progress as you go through the test.\n\u003Cbr\u003E\n\u003Cbr\u003E",
                  "title": "\u003Cp style=\"font-size: 2em; text-align: center;\"\u003ESynaesthesia Test Review\u003C\u002Fp\u003E"
                },
                {
                  "required": true,
                  "type": "divider"
                },
                {
                  "required": true,
                  "type": "image",
                  "src": "${ this.files[\"GC consistency test screenshot.png\"] }",
                  "name": ""
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {
                "GC consistency test screenshot.png": "embedded\u002F9b233eeed7d9046ab203038e4ff1446341aff8fdc49d49b7c1bc9987a3186b40.png"
              },
              "responses": {},
              "parameters": {},
              "messageHandlers": {
                "before:prepare": function anonymous(
) {
// Function to enable scrolling in full-screen mode
function enableScrollingInFullscreen(element) {
  element.style.overflow = 'auto';
}

// Enable scrolling on the body element
enableScrollingInFullscreen(document.body);
}
              },
              "title": "Language_colour_intro2",
              "width": "l",
              "tardy": true,
              "skip": "${this.state.GC_begin != 0}"
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "type": "text",
                  "content": "If you \u003Cb\u003E DO \u003C\u002Fb\u003E have definite and specific colour associations to letters and numbers then visualise these and select the best colour. \u003Cbr\u003E\u003Cbr\u003E\n\n\u003Cp class = alert alert-warning\u003E If, like the majority of people, you don’t do this then please \u003Cb\u003E press the \"no colour\" button to skip. \u003C\u002Fb\u003E \u003C\u002Fp\u003E\n\u003Cbr\u003E\n\n",
                  "title": "\u003Cheader\u003E   \u003Ch1 id=\"welcomeHeader\"\u003ERemember\u003C\u002Fh1\u003E \u003C\u002Fheader\u003E"
                },
                {
                  "required": true,
                  "type": "divider"
                },
                {
                  "required": true,
                  "type": "radio",
                  "label": "Please click ‘I understand’ to move to the next screen",
                  "options": [
                    {
                      "label": "I understand",
                      "coding": "1"
                    }
                  ],
                  "name": "GC_begin2"
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "GC_attention_check2",
              "tardy": true,
              "skip": "${this.state.GC_begin != 0}"
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Cstyle\u003E\n    \u002F* LAB.JS *\u002F\n    :root{\n        --line-height: 1 !important;\n    }\n    \n    button[type=\"submit\"][form=\"page-form\"]{\n        display: none;\n    }\n    \n    #container{\n        left: 50%;\n        transform: translateX(-50%);\n    }\n    \u002F* --------------- *\u002F\n\n    #container{\n        width: 70vmin;\n        position: relative;\n        display: grid;\n        grid-template-columns: auto;\n        row-gap: 5px;\n    }\n\n    #top-text{\n        display: flex;\n        justify-content: space-between;\n        font-size: 2vmin;\n    }\n\n    #picker{\n        display: flex;\n        gap: 10px;\n        width: 70vmin;\n        height: 30vmin;\n    }\n\n    canvas {\n        border-style: solid;\n    }\n\n    #grapheme {\n        margin: auto;\n        font-size: 25vmin;\n    }\n\n    #buttons {\n        display: flex;\n        justify-content: space-around;\n    }\n\n    .button{\n        font-size: 2vmin;\n        width: 15vmin;\n        height: 4vmin;\n    }\n\n\u003C\u002Fstyle\u003E\n\u003Cmain\u003E\n    \u003Cdiv id=\"container\"\u003E \u003C!-- 770 = (360*2) + 30 + 10px gaps--\u003E\n        \u003Cdiv id=\"top-text\"\u003E\n            \u003Cspan\u003EChoose the best colour by clicking on the colour-bar and shade box.\u003C\u002Fspan\u003E\n            \u003Cspan\u003E\u003Cspan id=\"remaining\"\u003E\u003C\u002Fspan\u003E left to do.\u003C\u002Fspan\u003E\n        \u003C\u002Fdiv\u003E\n        \u003Cdiv id=\"picker\"\u003E\n            \u003Ccanvas id=\"shade\" height=\"180\" width=\"180\"\u003E\u003C\u002Fcanvas\u003E\n            \u003Ccanvas id=\"hue\" height=\"180\" width=\"30\"\u003E\u003C\u002Fcanvas\u003E\n            \u003Cspan id=\"grapheme\" height=\"180\" width=\"180\"\u003EA\u003C\u002Fspan\u003E\n        \u003C\u002Fdiv\u003E\n        \u003Ccanvas id=\"display\" height=\"180\" width=\"410\"\u003E\u003C\u002Fcanvas\u003E\n        \u003Cdiv id=\"buttons\"\u003E\n            \u003Cinput type=\"button\" id=\"no_colour\" class=\"button\" value=\"No Colour\"\u003E\n            \u003Cinput type=\"button\" id=\"select\" class=\"button\"value='Select'\u003E\n        \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fmain\u003E\n",
                  "name": ""
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {
                "run": function anonymous(
) {
this.internals.root.parameters.prolific_ID = this.state.url.PROLIFIC_PID;
const prolific_id = this.internals.root.parameters.prolific_ID;


// Lab.js ---------------- NOTE: run this whole script on 'run' event
// create graphemes list based on answers to previous synaesthesia questions
const ds = this.options.datastore
//WAYS TO ACCESS THE FORM RESPONSES: ds.data[ds.data.length-1].letters; ds.get('letters'); ds.extract('letters','grapheme-questionnaire') where 'grapheme-questionnaire' is the name of the lab.js element
// Lab.js ---------------- NOTE: run this whole script on 'run' event
// create graphemes list based on answers to previous synaesthesia questions

const letter_syn = ds.get('language-colour') //name of HTML input element, returns selected value
const number_syn = ds.get('language-colour')

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const numbers = '0123456789'
let grapheme_set = ''
let data=[] //decalre here incase we end study before collecting data
let runTest = true;

grapheme_set += letters;
grapheme_set += numbers;

//store data at end of test
function endTest(end_text){
    //stuff to do when the exp is ended
    for(let i=0;i<data.length;i++){
        ds.commit(data[i])
    }

    document.getElementById('container').innerHTML = end_text+'<br><br><br><br>Please press the Next button below.'//JSON.stringify(data)
    document.querySelector('button[type="submit"][form="page-form"]').style.display = 'block';
    return
}

// CANVAS ------------------
const hue_canvas = document.getElementById("hue");
const hue_ctx = hue_canvas.getContext('2d');
const shade_canvas = document.getElementById("shade",{ willReadFrequently: true });
const shade_ctx = shade_canvas.getContext('2d');
const display_canvas = document.getElementById("display");
const display_ctx = display_canvas.getContext('2d');



// GRAPHEMES ------------------
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex > 0) { // While there remain elements to shuffle.
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function getGraphemes(raw_graphemes, repeats){
    //note we are going to check scores after the first pass of all grpahemes so need to be shuffled in sets
    let graphemes_array = raw_graphemes.split('') //make array
    let rep_graphemes = '';
    for(let i=0;i<repeats;i++){
        shuffle(graphemes_array) //shuffle array of graphemes
        rep_graphemes += graphemes_array.join('') //append as string
    }
    const graphemes = rep_graphemes.split('')
    return graphemes
}


// HUE -----------------
function drawHues(){
    const width = hue_canvas.width
    const height = hue_canvas.height
    hue_ctx.clearRect(0, 0, width, height)
    for(let h=0; h<361; h++){
        hue_ctx.fillStyle = `hsl(${h+offset}, 100%, 50%)`;
        hue_ctx.fillRect(0, h*(height/360), width, 2)
        //hue_ctx.strokeStyle = `hsl(${h+offset}, 100%, 50%)`
        //hue_ctx.beginPath()
        //hue_ctx.moveTo(0, h*(height/360))
        //hue_ctx.lineTo(width, h*(height/360))
        //hue_ctx.stroke()
    }
}

hue_canvas.addEventListener('mousedown',hueSelect);
hue_canvas.addEventListener('mouseup', ()=>{ hue_canvas.onmousemove = null });
hue_canvas.addEventListener('mouseout', ()=>{ hue_canvas.onmousemove = null });

function hueSelect(e){
    drawHues() //clear canvas
    //draw black line at location
    hue_ctx.strokeStyle = 'black';
    hue_ctx.beginPath();
    hue_ctx.moveTo(0, e.offsetY);
    hue_ctx.lineTo(hue_canvas.width, e.offsetY);
    hue_ctx.stroke();
    // replace canvas colour
    hue_loc = e.offsetY //laziness for handling resize events
    h = ((e.offsetY*(360/hue_canvas.height))+offset) % 360
    shadeSelect(shade_loc) // keep selected shade consistent
    shade_canvas.onmousemove = null //remove mousemove event added in shadeSelect()
    hue_canvas.onmousemove = hueSelect //add handler on click to move as well
}


// SHADE -----------------
function drawShades(h){
    shade_ctx.clearRect(0,0,shade_canvas.width,shade_canvas.height);
    const w = shade_canvas.width/100 //canvas width is 360, with 100 s and l values
    for(let s=0;s<101;s++){
        for(let l=0;l<101;l++){
            shade_ctx.fillStyle = `hsl(${h}, ${s}%, ${l}%)`;
            shade_ctx.fillRect(Math.ceil(s*w),Math.ceil(l*w),Math.ceil(w),Math.ceil(w)); //w+1 on last two also deals with aliasing well enough?
        }
    }
}

//selection on shade canvas
shade_canvas.addEventListener('mousedown',shadeSelect);
shade_canvas.addEventListener('mouseup', ()=>{ shade_canvas.onmousemove = null });
shade_canvas.addEventListener('mouseout', ()=>{ shade_canvas.onmousemove = null });

function shadeSelect(e){
    //hue must be selected first, and stop mousemove out of bounds
    if(h===undefined || e.offsetX>shade_canvas.width || e.offsetX<0 || e.offsetY>shade_canvas.height || e.offsetY<0){ return }
    //store data
    const w = shade_canvas.width/100
    data[trial_num].hsl = [h, Math.round(e.offsetX/w), Math.round(e.offsetY/w)] //store current hsl
    shade_loc = {'offsetX':e.offsetX, 'offsetY':e.offsetY} //store selected shade. stays the same on event of hue change.
    //draw on canvases
    drawShades(h) //redraw
    selectedColour(shade_loc)  //get colour on fresh draw
    //draw select circle
    shade_ctx.strokeStyle = 'black'
    shade_ctx.beginPath();
    shade_ctx.arc(e.offsetX, e.offsetY, w*1, 0, 2 * Math.PI);
    shade_ctx.stroke();
    shade_canvas.onmousemove = shadeSelect
}


// DSIPLAY -------------------
function selectedColour(e){
    select.disabled = false
    //get colour and put on other canvas, e.target.getContext('2d').getImageData()
    const p = shade_ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data; //rgb - can optionally use a input event?
    display_ctx.fillStyle = `rgb(${p})`;
    display_ctx.fillRect(0, 0, display_canvas.width, display_canvas.height)
    grapheme.style.color = `rgb(${p})`; //comment this out to remove chaning the font colour
    data[trial_num].rgb = Object.values(p).slice(0,-1) //store data
}


// BUTTONS ---------------------
const select = document.getElementById("select")
const no_colour = document.getElementById("no_colour")

select.addEventListener('click', buttonClick)
no_colour.addEventListener('click', buttonClick)

function buttonClick(e){
    if(e.target.id == 'no_colour'){ //wipe data if no colour selected
        data[trial_num].rgb = []
        data[trial_num].hsl = []
    }
    data[trial_num].no_colour = e.target.id==='no_colour'
    data[trial_num].reaction_time = e.timeStamp-start_time
    console.log(data)
    newTrial()
}


// RUN ----------------
//text displays
const grapheme = document.getElementById("grapheme")
const remaining = document.getElementById("remaining")

//globals
const graphemes = getGraphemes(grapheme_set,3) //repeats=2 returns 2 copies of array
let h, offset, shade_loc, trial_num = -1, hue_loc, start_time  //being lazy with the y

function newTrial() {
    trial_num++;
    if (trial_num === grapheme_set.length) { // STOPPING RULE
        const no_colour_count = data.filter(function (e) { return e.no_colour === true; });
        if (no_colour_count.length / grapheme_set.length > .9) { // end if >90% of trials were 'no colour'
            ds.commit({ stoppingRuleUsed_GC: 1 }); // Store the value 1 in the datastore
            endTest("You pressed the 'No Colour' button too many times to continue this test. This means you do not experience language-colour synaesthesia.");
            return;
        } else {
            ds.commit({ stoppingRuleUsed_GC: 0 }); // Store the value 0 in the datastore
        }
    } else if (trial_num == graphemes.length) { // END OF EXP
        endTest('');
        return;
    }

    //hues at random location
    offset = Math.floor(Math.random() * 361);
    drawHues()

    //clear display
    shade_ctx.clearRect(0, 0, shade_canvas.width, shade_canvas.height)
    display_ctx.clearRect(0, 0, display_canvas.width, display_canvas.height)
    select.disabled = true

    //clear globals
    h = undefined
    shade_loc = {'offsetX':shade_canvas.width-1, 'offsetY':shade_canvas.height/2} //init hue to max sat

    //setup data
    const g = graphemes[trial_num]
    data.push({
        'prolific_id': prolific_id,
        'trial_number': trial_num,
        'grapheme':g,
        'rgb':[],
        'hsl':[],
        'no_colour': false,
        'reaction_time':0,
        //'stoppingRuleUsed': 1  
    })
    
    //update html
    grapheme.style.color = 'black';
    grapheme.innerHTML = g;
    remaining.innerHTML = graphemes.length-trial_num
    start_time = performance.now()
}

if(runTest){
    newTrial()
}

// WINDOW RESIZE ------------
window.onresize = windowResize
let min = Math.min(window.innerWidth, window.innerHeight)

function windowResize(){ // set canvas size in HTML
    const change = min/Math.min(window.innerWidth, window.innerHeight)
    min = Math.min(window.innerWidth, window.innerHeight)
    const thirty = Math.round(.3*min)
    //document.getElementById("container").style.width = .7*min+'px'
    //document.getElementById("picker").style.width = .7*min+'px'
    //document.getElementById("picker").style.height = .3*min+'px'
    hue_canvas.height = thirty
    hue_canvas.width = thirty/10
    shade_canvas.width = thirty
    shade_canvas.height = thirty
    display_canvas.height = thirty
    display_canvas.width = .7*min
    drawHues() //redraw
    if(h!==undefined){ // redraw selected values
        let e = {'offsetY': hue_loc /= change } // too difficult to extract hue_loc from h otherwise..
        hueSelect(e)
        drawShades(h)
        if(change!=1){
            shade_loc.offsetX /= change
            shade_loc.offsetY /= change
        }
        shadeSelect(shade_loc)
        hue_canvas.onmousemove = null
        shade_canvas.onmousemove = null
    }
}

windowResize()
}
              },
              "title": "Grapheme_colour_synaesthesia"
            },
            {
              "type": "lab.flow.Sequence",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Grapheme_colour_questionnaire",
              "content": [
                {
                  "type": "lab.html.Page",
                  "items": [
                    {
                      "type": "text",
                      "title": "\u003Ch1 style=\"text-align: center;\"\u003E Thanks for telling us about how graphemes appear to you. \u003C\u002Fh1\u003E",
                      "content": "We have a few more questions about how you found the test. Using the scale below, please select the answer that best answers each question."
                    },
                    {
                      "required": true,
                      "type": "likert",
                      "items": [
                        {
                          "label": "\u003Cp style=\"width: 300px; text-align: left;\"\u003E When performing the experiment, I felt that I knew for certain what the colour for a letter or number should be. \u003C\u002Fp\u003E",
                          "coding": "Q1"
                        },
                        {
                          "label": "\u003Cp style=\"width: 300px; text-align: left;\"\u003EWhen performing the experiment, I felt as if I was guessing what the colour for a letter or number should be. \u003C\u002Fp\u003E",
                          "coding": "Q2"
                        },
                        {
                          "label": "\u003Cp style=\"width: 300px; text-align: left;\"\u003EWhenever I see or think about letters or numbers (printed black on white), I automatically experience the letter or number as having another colour (eg red). \u003C\u002Fp\u003E",
                          "coding": "Q3"
                        },
                        {
                          "label": "\u003Cp style=\"width: 300px; text-align: left;\"\u003EWhenever I see or think about letters or numbers (printed black on white), I would never naturally experience the letter or number as having another colour (eg red). \u003C\u002Fp\u003E",
                          "coding": "Q4"
                        },
                        {
                          "label": "\u003Cp style=\"width: 300px; text-align: left;\"\u003ELetters and numbers always evoke very precise colours (other than the colour they are printed in) and there were not enough colours on screen for me to choose from. \u003C\u002Fp\u003E",
                          "coding": "Q5"
                        },
                        {
                          "label": "\u003Cp style=\"width: 300px; text-align: left;\"\u003EI have always associated the same particular colours with letters and numbers, and they never seem to change. \u003C\u002Fp\u003E",
                          "coding": "Q6"
                        }
                      ],
                      "width": "6",
                      "anchors": [
                        "Strongly Disagree",
                        "Disagree",
                        "Slightly Disagree",
                        "Slightly Agree",
                        "Agree",
                        "Strongly Agree"
                      ],
                      "label": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E",
                      "name": "GC-test-questionnaire"
                    }
                  ],
                  "scrollTop": true,
                  "submitButtonText": "Next→",
                  "submitButtonPosition": "right",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Grapheme_colour_questionnaire",
                  "tardy": true,
                  "skip": "${this.state.stoppingRuleUsed_GC != 0}",
                  "width": "l"
                },
                {
                  "type": "lab.html.Page",
                  "items": [
                    {
                      "type": "text",
                      "title": "\u003Cheader\u003E \u003Cp style=\"font-size: 2em; text-align: center;\"\u003ENow let's do Synaesthesia Test 2 \u003C\u002Fp\u003E \u003C\u002Fheader\u003E",
                      "content": "In the next test you'll see numbers (0-9), days of the week (e.g., Tuesday), and months of the year (e.g., July) displayed in the centre of the screen.\u003Cbr\u003E\u003Cbr\u003E\nA minority of people automatically think about these concepts spatially in their everyday life, and if this is something you do, then you should use this to complete the task. When you see each item on the computer screen, visualise where it fits spatially and click the mouse in the corresponding location on the screen. \u003Cbr\u003E\u003Cbr\u003E\n\u003Cb style=\"color: red;\"\u003E IMPORTANT: For most other people this may seem like a strange task. If you don’t think about these concepts spatially then please press the 'Spacebar' or 'n' key to skip.\u003C\u002Fb\u003E\u003Cbr\u003E\u003Cbr\u003E\nEach item (number or day or month) is repeated between one and three times. Thank you for sticking with the task! You will be able to see your progress as you go through the test. \u003Cbr\u003E\u003Cbr\u003E\n\n"
                    }
                  ],
                  "scrollTop": true,
                  "submitButtonText": "Next→",
                  "submitButtonPosition": "right",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
const GC_questionnaire = this.options.datastore.data.filter(
  row => row.sender === 'Grapheme_colour_questionnaire' &&
          row.ended_on === 'form submission'
);

// Define reverse coded questions
const reverseCodedQuestions = ['GC-test-questionnaire-Q2', 'GC-test-questionnaire-Q4'];

const gc_qscore = GC_questionnaire.reduce((score, row) => {
  // Iterate over each question response in the row
  for (const [key, value] of Object.entries(row)) {
    if (key.startsWith('GC-test-questionnaire-')) {
      // Adjust the score from 1-6 to 0-5
      let adjustedScore = value - 1;

      // Reverse the score if the question is reverse coded
      if (reverseCodedQuestions.includes(key)) {
        adjustedScore = 5 - adjustedScore;
      }

      // Add the adjusted score to the total score
      score += adjustedScore;
    }
  }
  return score;
}, 0);

this.data.gc_qscore = gc_qscore;
const likely_GCSyn = gc_qscore > 17;
this.data.likely_GCSyn = likely_GCSyn ? 1 : 0;

}
                  },
                  "title": "Calculate_gc_q_score",
                  "width": "l"
                }
              ]
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "type": "text",
                  "content": "If you \u003Cb\u003E DO \u003C\u002Fb\u003E have definite and specific spatial associations to time and number then visualise these and click on the appropriate part of the screen. \u003Cbr\u003E\u003Cbr\u003E\n\n\u003Cp class = alert alert-warning\u003E If, like the majority of people, you don’t do this then please \u003Cb\u003E press spacebar or 'n' to skip. \u003C\u002Fb\u003E \u003C\u002Fp\u003E\n\u003Cbr\u003E\n\n",
                  "title": "\u003Cheader\u003E   \u003Ch1 id=\"welcomeHeader\"\u003ERemember\u003C\u002Fh1\u003E \u003C\u002Fheader\u003E"
                },
                {
                  "required": true,
                  "type": "divider"
                },
                {
                  "required": true,
                  "type": "radio",
                  "label": "Please click ‘I understand’ to move to the next screen",
                  "options": [
                    {
                      "label": "I understand",
                      "coding": "1"
                    },
                    {
                      "label": "I do not understand",
                      "coding": "0"
                    }
                  ],
                  "name": "SS_begin"
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "SS_attention_check"
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "type": "text",
                  "title": "\u003Cheader\u003E   \u003Ch1 id=\"welcomeHeader\"\u003EThat's okay!\u003C\u002Fh1\u003E \u003C\u002Fheader\u003E",
                  "content": "Please carefully review the instructions again, then select \"I understand\"."
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Review_message",
              "tardy": true,
              "skip": "${this.state.SS_begin != 0}"
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "type": "text",
                  "title": "\u003Cheader\u003E \u003Cp style=\"font-size: 2em; text-align: center;\"\u003ESynaesthesia Test Review \u003C\u002Fp\u003E \u003C\u002Fheader\u003E",
                  "content": "In the next test you'll see numbers (0-9), days of the week (e.g., Tuesday), and months of the year (e.g., July) displayed in the centre of the screen.\u003Cbr\u003E\u003Cbr\u003E\nA minority of people automatically think about these concepts spatially in their everyday life, and if this is something you do, then you should use this to complete the task. When you see each item on the computer screen, visualise where it fits spatially and click the mouse in the corresponding location on the screen. \u003Cbr\u003E\u003Cbr\u003E\n\u003Cb style=\"color: red;\"\u003E IMPORTANT: For most other people this may seem like a strange task. If you don’t think about these concepts spatially then please press the 'Spacebar' or 'n' key to skip.\u003C\u002Fb\u003E\u003Cbr\u003E\u003Cbr\u003E\nEach item (number or day or month) is repeated between one and three times. Thank you for sticking with the task! You will be able to see your progress as you go through the test. \u003Cbr\u003E\u003Cbr\u003E\n\n"
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Sequence_Space_Intro2",
              "width": "l",
              "tardy": true,
              "skip": "${this.state.SS_begin != 0}"
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "type": "text",
                  "content": "If you \u003Cb\u003E DO \u003C\u002Fb\u003E have definite and specific spatial associations to time and number then visualise these and click on the appropriate part of the screen. \u003Cbr\u003E\u003Cbr\u003E\n\n\u003Cp class = alert alert-warning\u003E If, like the majority of people, you don’t do this then please \u003Cb\u003E press spacebar or 'n' to skip. \u003C\u002Fb\u003E \u003C\u002Fp\u003E\n\u003Cbr\u003E\n\n",
                  "title": "\u003Cheader\u003E   \u003Ch1 id=\"welcomeHeader\"\u003ERemember\u003C\u002Fh1\u003E \u003C\u002Fheader\u003E"
                },
                {
                  "required": true,
                  "type": "divider"
                },
                {
                  "required": true,
                  "type": "radio",
                  "label": "Please click ‘I understand’ to move to the next screen",
                  "options": [
                    {
                      "label": "I understand",
                      "coding": "1"
                    }
                  ],
                  "name": "SS_begin"
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "SS_attention_check2",
              "tardy": true,
              "skip": "${this.state.SS_begin != 0}"
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Cstyle\u003E\n    \u002F* LAB.JS *\u002F\n    :root{\n        --line-height: 1 !important;\n    }\n\n#main {\n    position: absolute;\n    background-color: white;\n    overflow: hidden;\n    height: 100vh;\n    width: 100vw;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n}\n\n#main.end-state {\n    height: auto;\n    min-height: calc(100vh - 300px);\n    width: 80%;\n    max-width: 800px;\n    overflow: visible;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    padding: 20px;\n    box-sizing: border-box;\n}\n\n#main.end-state #sequence {\n    position: static;\n    transform: none;\n    max-width: 100%;\n    text-align: center;\n}\n\n    .unhook{\n        height: auto !important;\n    }\n    \n    \u002F* -------------------- *\u002F\n    p {\n    \u002F* Stop text highlighting *\u002F\n    -webkit-touch-callout: none; \u002F* iOS Safari *\u002F\n      -webkit-user-select: none; \u002F* Safari *\u002F\n       -khtml-user-select: none; \u002F* Konqueror HTML *\u002F\n         -moz-user-select: none; \u002F* Old versions of Firefox *\u002F\n          -ms-user-select: none; \u002F* Internet Explorer\u002FEdge *\u002F\n              user-select: none; \u002F* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox *\u002F\n    }\n\n    #counter{\n        float: right;\n    }\n\n    #sequence{\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translate(-50%, -50%);\n        max-width: 80%;\n        word-wrap: break-word;\n        font-size: 20px;\n    }\n        .sequence-item {\n    font-size: 1.5em; \u002F* Adjust the font size as desired *\u002F\n}\n\n\u003C\u002Fstyle\u003E\n\n\u003Cmain id=\"main\"\u003E\n    \u003Cp id=\"counter\" hidden\u003E\u003Cspan id=\"count\"\u003E\u003C\u002Fspan\u003E trials remaining\u003Cbr\u003E\u003Cbr\u003E\u003Cb \u003E Press Spacebar or 'n' if no association. \u003C\u002Fb\u003E\u003Cbr\u003E\u003Cbr\u003E \u003Cb\u003E Do not drag the object from the middle - click the endpoint in space instead. \u003C\u002Fb\u003E\u003C\u002Fp\u003E\n    \u003Cp id=\"sequence\"\u003E\n    \u003Cb style=\"font-size: 2em;\"\u003EBegin Synaesthesia Test 2\u003C\u002Fb\u003E \u003Cbr\u003E\u003Cbr\u003E\u003Cbr\u003E\n      \u003Cbr\u003E\u003Cbr\u003E\u003Cbr\u003E\n        \u003Ci\u003EPlease press Spacebar to continue.\u003C\u002Fi\u003E\n    \u003C\u002Fp\u003E\n\u003C\u002Fmain\u003E\n\n",
                  "name": ""
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {
                "run": function anonymous(
) {
this.internals.root.parameters.prolific_ID = this.state.url.PROLIFIC_PID;
const prolific_id = this.internals.root.parameters.prolific_ID;

// Lab.js ----------------
const ds = this.options.datastore

function endTest(end_text) {
    document.removeEventListener('click', changeText);
    document.removeEventListener('keydown', changeText);
    document.getElementById('counter').hidden = true;

    for(let i=0; i<data.length; i++){
        ds.commit(data[i]);
    }

    const mainElement = document.getElementById("main");
    mainElement.className = "end-state";

    const sequenceElement = document.getElementById("sequence");
    sequenceElement.innerHTML = end_text + '<br><br>Please press the Next button below.';
}

// Stimuli ----------------
const sequences_set = ['<span class="sequence-item">0</span>','<span class="sequence-item">1</span>','<span class="sequence-item">2</span>','<span class="sequence-item">3</span>','<span class="sequence-item">4</span>','<span class="sequence-item">5</span>','<span class="sequence-item">6</span>','<span class="sequence-item">7</span>','<span class="sequence-item">8</span>','<span class="sequence-item">9</span>',
            '<span class="sequence-item">Monday</span>','<span class="sequence-item">Tuesday</span>','<span class="sequence-item">Wednesday</span>','<span class="sequence-item">Thursday</span>','<span class="sequence-item">Friday</span>','<span class="sequence-item">Saturday</span>','<span class="sequence-item">Sunday</span>',
            '<span class="sequence-item">January</span>', '<span class="sequence-item">February</span>', '<span class="sequence-item">March</span>', '<span class="sequence-item">April</span>', '<span class="sequence-item">May</span>', '<span class="sequence-item">June</span>', '<span class="sequence-item">July</span>', '<span class="sequence-item">August</span>', 
            '<span class="sequence-item">September</span>', '<span class="sequence-item">October</span>', '<span class="sequence-item">November</span>', '<span class="sequence-item">December</span>']


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex > 0) { // While there remain elements to shuffle.
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function duplicateArray(array, repeats){
    const duplicated = []
    for(let i=0;i<repeats;i++){
        shuffle(array)
        duplicated.push(... array) //nested for loop as polyfill?
    }
    return duplicated
}

const seqs = duplicateArray(sequences_set,3) //e.g. dups=2 doubles array

// Run ----------------
let trial_number = -1, start_time //trial -1 is the instruction screen
const data = [];
const text = document.getElementById('sequence')
const count = document.getElementById('count')

document.addEventListener('click',changeText)
document.addEventListener('keydown',changeText)

function changeText(e){
    const keydown = e.type === 'keydown'
    if(keydown && e.key === ' ') {
        e.preventDefault(); // Prevent default spacebar behavior
    }
    if(keydown && e.key!=' ' && e.key!='n'){ return }

    if(trial_number>-1){ // save data after first trial
        data.push({ //save
            'prolific_id': prolific_id,
            'sequence': seqs[trial_number].replace(/<[^>]*>/g, ''),
            'x': keydown ? -1 : e.clientX, //consider screen, client, page, offset coordinates
            'y': keydown ? -1 : e.clientY,
            'window_width': window.innerWidth,
            'window_height': window.innerHeight,
            'no_association': keydown,
            'reaction_time': e.timeStamp-start_time,
        })
        console.log(data)
    } else { //on first click
        if(!keydown){return} // first click may be a little hasty...
        document.getElementById('counter').hidden = false
    }

    //last click end exp
    if(trial_number === seqs.length-1){
        ds.commit({ stoppingRuleUsed_SS: 0 }) 
        endTest('You have reached the end of this test.<br>')
        return
    } else if(trial_number === sequences_set.length){ //STOPPING RULE
        const no_association_count = data.filter(function(e){return e.no_association === true})
        if(no_association_count.length/sequences_set.length > .9){
            ds.commit({ stoppingRuleUsed_SS: 1 });
            endTest("You pressed the 'No Association' key too many times to continue this test. This means you do not experience sequence-space synaesthesia.")
            return
        }
    }

    trial_number++ //increase trial number
    text.innerHTML = seqs[trial_number]
    count.innerHTML = seqs.length-trial_number
    start_time = performance.now()
}
}
              },
              "title": "Sequence_space_synaesthesia",
              "width": "m"
            },
            {
              "type": "lab.flow.Sequence",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Sequence_space_questionnaire",
              "content": [
                {
                  "type": "lab.html.Page",
                  "items": [
                    {
                      "type": "text",
                      "title": "\u003Cheader\u003E \u003Ch2\u003E Thanks for telling us about how sequences appear in space for you. \u003C\u002Fh2\u003E \u003C\u002Fheader\u003E",
                      "content": "We have a few more questions about how you found the test."
                    },
                    {
                      "required": true,
                      "type": "likert",
                      "items": [
                        {
                          "label": "Do you think this might apply to you?",
                          "coding": "routine"
                        }
                      ],
                      "width": "5",
                      "anchors": [
                        "Strongly Agree",
                        "Agree",
                        "Neither Agree nor Disagree",
                        "Disagree",
                        "Strongly Disagree"
                      ],
                      "label": "Some people routinely think about sequences as arranged in a particular spatial configuration.",
                      "name": "SS-routine"
                    },
                    {
                      "required": false,
                      "type": "checkbox",
                      "label": "\u003Cbr\u003E\u003Cbr\u003EWhich of the following do you routinely think about in this way? ",
                      "options": [
                        {
                          "label": "Numbers",
                          "coding": "numbers"
                        },
                        {
                          "label": "Days",
                          "coding": "days"
                        },
                        {
                          "label": "Months",
                          "coding": "months"
                        },
                        {
                          "label": "Years",
                          "coding": "years"
                        },
                        {
                          "label": "Letters of the Alphabet",
                          "coding": "letters"
                        },
                        {
                          "label": "Temperature",
                          "coding": "temperature"
                        },
                        {
                          "label": "Height ",
                          "coding": "height"
                        },
                        {
                          "label": "Weight",
                          "coding": "weight"
                        }
                      ],
                      "name": "SS-routine-types"
                    },
                    {
                      "required": true,
                      "type": "radio",
                      "label": "\u003Cbr\u003E\u003Cbr\u003EWhere do you tend to routinely experience these sequences?",
                      "options": [
                        {
                          "label": "In the space outside my body",
                          "coding": "1"
                        },
                        {
                          "label": "On an imagined space that has no real location",
                          "coding": "2"
                        },
                        {
                          "label": "Inside my body",
                          "coding": "3"
                        },
                        {
                          "label": "This doesn't apply to me!",
                          "coding": "4"
                        }
                      ],
                      "name": "SS-location"
                    },
                    {
                      "required": false,
                      "type": "textarea",
                      "label": "\u003Cbr\u003E\u003Cbr\u003EWhat kind of characteristics do these spatial sequences always tend to take? (Colours; shading; 2D; 3D; perspective; like blocks or tiles; a certain font)",
                      "name": "SS-characteristics"
                    }
                  ],
                  "scrollTop": true,
                  "submitButtonText": "Next→",
                  "submitButtonPosition": "right",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Sequence_space_questionnaire_routine",
                  "tardy": true,
                  "skip": "${this.state.stoppingRuleUsed_SS != 0}",
                  "width": "l"
                },
                {
                  "type": "lab.html.Page",
                  "items": [
                    {
                      "required": true,
                      "type": "likert",
                      "items": [
                        {
                          "label": "Before doing this experiment, I always thought about NUMBERS as existing in a particular spatial sequence",
                          "coding": "numbers"
                        },
                        {
                          "label": "Before doing this experiment, I always thought about DAYS OF THE WEEK as existing in a particular spatial sequence ",
                          "coding": "days"
                        },
                        {
                          "label": "Before doing this experiment, I always thought about MONTHS OF THE YEAR as existing in a particular spatial sequence",
                          "coding": "months"
                        },
                        {
                          "label": "I use this way of thinking about spatial sequences in my everyday life",
                          "coding": "everyday"
                        }
                      ],
                      "width": "5",
                      "anchors": [
                        "Strongly Agree",
                        "Agree",
                        "Neither Agree nor Disagree",
                        "Disagree",
                        "Strongly Disagree"
                      ],
                      "label": "\u003Cheader\u003E \u003Ch3\u003E Please select an answer for each item on the scale \u003C\u002Fh3\u003E\u003C\u002Fheader\u003E",
                      "name": "SS-before"
                    }
                  ],
                  "scrollTop": true,
                  "submitButtonText": "Next→",
                  "submitButtonPosition": "right",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Sequence_space_questionnaire_before",
                  "tardy": true,
                  "skip": "${this.state.stoppingRuleUsed_SS != 0}",
                  "width": "l"
                },
                {
                  "type": "lab.html.Page",
                  "items": [
                    {
                      "required": true,
                      "type": "likert",
                      "items": [
                        {
                          "label": "When doing the experiment, I didn't have any strong intuition as to where to put the NUMBERS",
                          "coding": "intuition-numbers"
                        },
                        {
                          "label": "When doing the experiment, I didn't have any strong intuition as to where to put the DAYS OF THE WEEK ",
                          "coding": "intuition-days"
                        },
                        {
                          "label": "When doing the experiment, I didn't have any strong intuition as to where to put the MONTHS OF THE YEAR",
                          "coding": "intuition-months"
                        },
                        {
                          "label": "This experiment didn't really make much sense to me",
                          "coding": "intuition-none"
                        }
                      ],
                      "width": "5",
                      "anchors": [
                        "Strongly Agree",
                        "Agree",
                        "Neither Agree nor Disagree",
                        "Disagree",
                        "Strongly Disagree"
                      ],
                      "label": "\u003Cheader\u003E \u003Ch3\u003E Please select an answer for each item on the scale \u003C\u002Fh3\u003E\u003C\u002Fheader\u003E",
                      "name": "SS-during"
                    },
                    {
                      "required": false,
                      "type": "textarea",
                      "label": "Feel free to enter any comments here. E.g. what strategy did you use? Do you want to clarify any of the above answers?",
                      "name": "SS-clarification"
                    }
                  ],
                  "scrollTop": true,
                  "submitButtonText": "Next→",
                  "submitButtonPosition": "right",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Sequence_space_questionnaire_during",
                  "tardy": true,
                  "skip": "${this.state.stoppingRuleUsed_SS != 0}",
                  "width": "l"
                },
                {
                  "type": "lab.html.Page",
                  "items": [
                    {
                      "type": "text",
                      "title": "\u003Cp style=\"font-size: 2em; text-align: center;\"\u003EGreat! \u003C\u002Fp\u003E",
                      "content": "Thanks for completing the synaesthesia test section. \n"
                    }
                  ],
                  "scrollTop": true,
                  "submitButtonText": "Next→",
                  "submitButtonPosition": "right",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
const SS_questionnaire = this.options.datastore.data.filter(
  row => (row.sender === 'Sequence_space_questionnaire_routine' || 
          row.sender === 'Sequence_space_questionnaire_before' || 
          row.sender === 'Sequence_space_questionnaire_during') &&
         row.ended_on === 'form submission'
);

const reverseCodeDuring = (value) => {
  // Assuming the values range from 1 to 5
  return 6 - value;
};

const ss_qscore = SS_questionnaire.reduce((score, row) => {
  for (const [key, value] of Object.entries(row)) {
    if (key.startsWith('SS-during')) {
      // Reverse code the items in the 'SS-during' section
      score += reverseCodeDuring(value);
    } else if (key.startsWith('SS-before') || key.startsWith('SS-routine')) {
      // Check if the value is boolean before adding it
      if (typeof value === 'boolean') {
        // Do nothing for boolean values in the SS-routine section
      } else if (typeof value === 'number') {
        // Assume values are in the range of 1 to 5, just add them
        score += value;
      }
    }
  }
  return score;
}, 0);

this.data.ss_qscore = ss_qscore;
const likely_ssSyn = ss_qscore < 19;
this.data.likely_ssSyn = likely_ssSyn ? 1 : 0;

}
                  },
                  "title": "Calculate_ss_q_score"
                }
              ]
            }
          ]
        },
        {
          "type": "lab.flow.Sequence",
          "files": {},
          "responses": {},
          "parameters": {},
          "messageHandlers": {
            "before:prepare": function anonymous(
) {
const ds = this.options.datastore

const stoppingRuleUsed_GC = ds.get('stoppingRuleUsed_GC'); // Retrieve value for 'stoppingRuleUsed_GC' and assign it to stoppingRuleUsed
const stoppingRuleUsed_SS = ds.get('stoppingRuleUsed_SS'); // Retrieve value for 'stoppingRuleUsed_SS' and assign it to stoppingRuleUsed_SS
}
          },
          "title": "Syn_Types_Sequence",
          "tardy": true,
          "skip": "${this.state.stoppingRuleUsed_GC === 1 && this.state.stoppingRuleUsed_SS === 1 &&   this.state.group !== 'synaesthete' }",
          "content": [
            {
              "type": "lab.html.Screen",
              "files": {},
              "responses": {
                "click button": "continue"
              },
              "parameters": {},
              "messageHandlers": {
                "before:prepare": function anonymous(
) {

this.options.events['click input[name="language-colour"]'] = function(e) {
  if (e.target.value === 'yes') {
    showOptions('language-colour-options');
  } else {
    hideOptions('language-colour-options');
  }
};

this.options.events['click input[name="sensation-colour"]'] = function(e) {
  if (e.target.value === 'yes') {
    showOptions('sensation-colour-options');
  } else {
    hideOptions('sensation-colour-options');
  }
};

this.options.events['click input[name="sensation-shape"]'] = function(e) {
  if (e.target.value === 'yes') {
    showOptions('sensation-shape-options');
  } else {
    hideOptions('sensation-shape-options');
  }
};

this.options.events['click input[name="language-taste"]'] = function(e) {
  if (e.target.value === 'yes') {
    showOptions('language-taste-options');
  } else {
    hideOptions('language-taste-options');
  }
};

this.options.events['click input[name="sequence-space"]'] = function(e) {
  if (e.target.value === 'yes') {
    showOptions('sequence-space-options');
  } else {
    hideOptions('sequence-space-options');
  }
};

this.options.events['click input[name="personification"]'] = function(e) {
  if (e.target.value === 'yes') {
    showOptions('personification-options');
  } else {
    hideOptions('personification-options');
  }
};

this.options.events['click input[name="mirror-touch"]'] = function(e) {
  if (e.target.value === 'yes') {
    showOptions('mirror-touch-options');
  } else {
    hideOptions('mirror-touch-options');
  }
};

this.options.events['click input[name="tickertape"]'] = function(e) {
  if (e.target.value === 'yes') {
    showOptions('tickertape-options');
  } else {
    hideOptions('tickertape-options');
  }
};

this.options.events['click input[name="hearing-motion"]'] = function(e) {
  if (e.target.value === 'yes') {
    showOptions('hearing-motion-options');
  } else {
    hideOptions('hearing-motion-options');
  }
};

function showOptions(optionsId) {
  document.getElementById(optionsId).style.display = "block";
}

function hideOptions(optionsId) {
  document.getElementById(optionsId).style.display = "none";
}
},
                "end": function anonymous(
) {
const ds = this.options.datastore;

// Save radio button values
const languageColour = document.querySelector('input[name="language-colour"]:checked').value;
const sensationColour = document.querySelector('input[name="sensation-colour"]:checked').value;
const sensationShape = document.querySelector('input[name="sensation-shape"]:checked').value;
const languageTaste = document.querySelector('input[name="language-taste"]:checked').value;
const sequenceSpace = document.querySelector('input[name="sequence-space"]:checked').value;
const personification = document.querySelector('input[name="personification"]:checked').value;
const mirrorTouch = document.querySelector('input[name="mirror-touch"]:checked').value;
const tickertape = document.querySelector('input[name="tickertape"]:checked').value;
const hearingMotion = document.querySelector('input[name="hearing-motion"]:checked').value;

// Save checkbox values
const languageColourOptions = Array.from(document.querySelectorAll('input[name="language-colour-options"]:checked')).map(checkbox => checkbox.nextElementSibling.textContent.trim());
const sensationColourOptions = Array.from(document.querySelectorAll('input[name="sensation-colour-options"]:checked')).map(checkbox => checkbox.nextElementSibling.textContent.trim());
const sensationShapeOptions = Array.from(document.querySelectorAll('input[name="sensation-shape-options"]:checked')).map(checkbox => checkbox.nextElementSibling.textContent.trim());
const languageTasteOptions = Array.from(document.querySelectorAll('input[name="language-taste-options"]:checked')).map(checkbox => checkbox.nextElementSibling.textContent.trim());
const sequenceSpaceOptions = Array.from(document.querySelectorAll('input[name="sequence-space-options"]:checked')).map(checkbox => checkbox.nextElementSibling.textContent.trim());
const personificationOptions = Array.from(document.querySelectorAll('input[name="personification-options"]:checked')).map(checkbox => checkbox.nextElementSibling.textContent.trim());
const mirrorTouchOptions = Array.from(document.querySelectorAll('input[name="mirror-touch-options"]:checked')).map(checkbox => checkbox.nextElementSibling.textContent.trim());
const tickertapeOptions = Array.from(document.querySelectorAll('input[name="tickertape-options"]:checked')).map(checkbox => checkbox.nextElementSibling.textContent.trim());
const hearingMotionOptions = Array.from(document.querySelectorAll('input[name="hearing-motion-options"]:checked')).map(checkbox => checkbox.nextElementSibling.textContent.trim());

// Save the values to the datastore
ds.set('languageColour', languageColour);
ds.set('sensationColour', sensationColour);
ds.set('sensationShape', sensationShape);
ds.set('languageTaste', languageTaste);
ds.set('sequenceSpace', sequenceSpace);
ds.set('personification', personification);
ds.set('mirrorTouch', mirrorTouch);
ds.set('tickertape', tickertape);
ds.set('hearingMotion', hearingMotion);
ds.set('languageColourOptions', languageColourOptions.length > 0 ? languageColourOptions : ['None selected']);
ds.set('sensationColourOptions', sensationColourOptions.length > 0 ? sensationColourOptions : ['None selected']);
ds.set('sensationShapeOptions', sensationShapeOptions.length > 0 ? sensationShapeOptions : ['None selected']);
ds.set('languageTasteOptions', languageTasteOptions.length > 0 ? languageTasteOptions : ['None selected']);
ds.set('sequenceSpaceOptions', sequenceSpaceOptions.length > 0 ? sequenceSpaceOptions : ['None selected']);
ds.set('personificationOptions', personificationOptions.length > 0 ? personificationOptions : ['None selected']);
ds.set('mirrorTouchOptions', mirrorTouchOptions.length > 0 ? mirrorTouchOptions : ['None selected']);
ds.set('tickertapeOptions', tickertapeOptions.length > 0 ? tickertapeOptions : ['None selected']);
ds.set('hearingMotionOptions', hearingMotionOptions.length > 0 ? hearingMotionOptions : ['None selected']);
}
              },
              "title": "Syn_Types_Questionnaire",
              "content": "\u003Cstyle\u003E\r\n  form {\r\n    font-family: Arial, sans-serif;\r\n    padding: 20px;\r\n    border-radius: 5px;\r\n  }\r\n\r\n  label {\r\n    margin-bottom: 10px;\r\n  }\r\n\r\n  input[type=\"radio\"],\r\n  input[type=\"checkbox\"] {\r\n    margin-bottom:10px;\r\n    margin-right: 5px;\r\n  }\r\n\r\n  .options-container {\r\n    margin-left: 20px;\r\n    margin-bottom: 20px;\r\n  }\r\n\r\n  .divider {\r\n    border-top: 1px solid #ccc;\r\n    margin: 20px 0;\r\n  }\r\n\r\n.checkbox-group {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  justify-content: center;\r\n  align-items: center;\r\n  margin-bottom: 10px;\r\n}\r\n\r\n.checkbox-group label {\r\n  margin-right: 20px;\r\n  margin-bottom: 10px;\r\n}\r\n\r\n.checkbox-group input[type=\"checkbox\"] {\r\n  margin-right: 5px;\r\n  margin-left: 10px;\r\n  vertical-align: middle;\r\n}\r\n\r\n  @media (max-width: 600px) {\r\n    form {\r\n      padding: 10px;\r\n    }\r\n\r\n    label {\r\n      font-size: 14px;\r\n    }\r\n\r\n    .video-container {\r\n    position: relative;\r\n    padding-bottom: 56.25%;\r\n    height: 0;\r\n    overflow: hidden;\r\n  }\r\n\r\n  .video-container iframe {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n  }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003CHeader\u003E \u003Ch2\u003E Please tell us about any types of synaesthesia that you may have \u003C\u002Fh2\u003E \u003C\u002Fheader\u003E\r\n\u003Cmain\u003E\r\n\r\n\u003Cdiv style=\"display: flex; justify-content: center;\"\u003E\r\n  \u003Cform id=\"synaesthesia-form\" style=\"max-width: 1500px;\"\u003E\r\n    \u003Clabel for=\"language-colour\" style=\"font-size: 18px;\"\u003E\u003Cb\u003ELetters, numbers or words have colours.\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\u003Cbr\u003E\r\n    \u003Cinput type=\"radio\" id=\"language-colour_yes\" name=\"language-colour\" value=\"yes\" onclick=\"showOptions('language-colour-options')\" required\u003E\r\n    \u003Clabel for=\"language-colour_yes\"\u003EYes\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"radio\" id=\"language-colour_no\" name=\"language-colour\" value=\"no\" onclick=\"hideOptions('language-colour-options')\" required\u003E\r\n    \u003Clabel for=\"language-colour_no\"\u003ENo\u003C\u002Flabel\u003E\u003Cbr\u003E\u003Cbr\u003E\r\n    \u003Cdiv id=\"language-colour-options\" class=\"options-container\" style=\"display: none;\"\u003E\r\n      \u003Cb\u003EWhat has colour?\u003C\u002Fb\u003E\u003Cbr\u003E\r\n      \u003Cdiv class=\"checkbox-group\"\u003E \r\n        \u003Cinput type=\"checkbox\" id=\"language-colour-numbers\" name=\"language-colour-options\" value=\"language-colour-numbers\"\u003E\r\n        \u003Clabel for=\"language-colour-numbers\"\u003ENumbers\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"language-colour-letters\" name=\"language-colour-options\" value=\"language-colour-letters\"\u003E\r\n        \u003Clabel for=\"language-colour-letters\"\u003ELetters\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"language-colour-days\" name=\"language-colour-options\" value=\"language-colour-days\"\u003E\r\n        \u003Clabel for=\"language-colour-days\"\u003EDays of the week\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"language-colour-months\" name=\"language-colour-options\" value=\"language-colour-months\"\u003E\r\n        \u003Clabel for=\"language-colour-months\"\u003EMonths of the year\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"language-colour-names\" name=\"language-colour-options\" value=\"language-colour-names\"\u003E\r\n        \u003Clabel for=\"language-colour-names\"\u003EPeople's names\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"langiage-colour-english\" name=\"language-colour-options\" value=\"language-colour-english\"\u003E\r\n        \u003Clabel for=\"language-colour-english\"\u003EEnglish words\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"language-colour-nonenglish\" name=\"language-colour-options\" value=\"language-colour-nonenglish\"\u003E\r\n        \u003Clabel for=\"language-colour-nonenglish\"\u003ENon-English words\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"language-colour-punctuation\" name=\"language-colour-options\" value=\"language-colour-punctuation\"\u003E\r\n        \u003Clabel for=\"language-colour-punctuation\"\u003EPunctuation\u003C\u002Flabel\u003E\r\n      \u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n\r\n    \u003Cdiv class=\"divider\"\u003E\u003C\u002Fdiv\u003E\r\n\r\n    \u003Clabel for=\"sensation-colour\" style=\"font-size: 18px;\"\u003E\u003Cb\u003ESensations (e.g. sounds, pain, taste) have colours.\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\u003Cbr\u003E\r\n    \u003Cinput type=\"radio\" id=\"sensation-colour_yes\" name=\"sensation-colour\" value=\"yes\" onclick=\"showOptions('sensation-colour-options')\" required\u003E\r\n    \u003Clabel for=\"sensation-colour_yes\"\u003EYes\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"radio\" id=\"sensation-colour_no\" name=\"sensation-colour\" value=\"no\" onclick=\"hideOptions('sensation-colour-options')\" required\u003E\r\n    \u003Clabel for=\"sensation-colour_no\"\u003ENo\u003C\u002Flabel\u003E\u003Cbr\u003E\u003Cbr\u003E\r\n    \u003Cdiv id=\"sensation-colour-options\" class=\"options-container\" style=\"display: none;\"\u003E\r\n      \u003Cb\u003EWhat has colour?\u003C\u002Fb\u003E\u003Cbr\u003E\r\n      \u003Cdiv class=\"checkbox-group\"\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-colour-music\" name=\"sensation-colour-options\" value=\"sensation-colour-music\"\u003E\r\n        \u003Clabel for=\"sensation-colour-music\"\u003EMusic\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-colour-voices\" name=\"sensation-colour-options\" value=\"sensation-colour-voices\"\u003E\r\n        \u003Clabel for=\"sensation-colour-voices\"\u003EVoices\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-colour-noises\" name=\"sensation-colour-options\" value=\"sensation-colour-noises\"\u003E\r\n        \u003Clabel for=\"sensation-colour-noises\"\u003ENoises\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-colour-emotions\" name=\"sensation-colour-options\" value=\"sensation-colour-emotions\"\u003E\r\n        \u003Clabel for=\"sensation-colour-emotions\"\u003EEmotions\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-colour-pain\" name=\"sensation-colour-options\" value=\"sensation-colour-pain\"\u003E\r\n        \u003Clabel for=\"sensation-colour-pain\"\u003EPain\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-colour-touch\" name=\"sensation-colour-options\" value=\"sensation-colour-touch\"\u003E\r\n        \u003Clabel for=\"sensation-colour-touch\"\u003ETouch\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-colour-smells\" name=\"sensation-colour-options\" value=\"sensation-colour-smells\"\u003E\r\n        \u003Clabel for=\"sensation-colour-smells\"\u003ESmells\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-colour-tastes\" name=\"sensation-colour-options\" value=\"sensation-colour-tastes\"\u003E\r\n        \u003Clabel for=\"sensation-colour-tastes\"\u003ETastes\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-colour-postures\" name=\"sensation-colour-options\" value=\"sensation-colour-postures\"\u003E\r\n        \u003Clabel for=\"sensation-colour-postures\"\u003EBody postures\u003C\u002Flabel\u003E\r\n      \u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n\r\n    \u003Cdiv class=\"divider\"\u003E\u003C\u002Fdiv\u003E\r\n\r\n    \u003Clabel for=\"sensation-shape\" style=\"font-size: 18px;\"\u003E\u003Cb\u003ESensations (e.g. sounds, pain, taste) have shapes.\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\u003Cbr\u003E\r\n    \u003Cinput type=\"radio\" id=\"sensation-shape_yes\" name=\"sensation-shape\" value=\"yes\" onclick=\"showOptions('sensation-shape-options')\" required\u003E\r\n    \u003Clabel for=\"sensation-shape_yes\"\u003EYes\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"radio\" id=\"sensation-shape_no\" name=\"sensation-shape\" value=\"no\" onclick=\"hideOptions('sensation-shape-options')\" required\u003E\r\n    \u003Clabel for=\"sensation-shape_no\"\u003ENo\u003C\u002Flabel\u003E\u003Cbr\u003E\u003Cbr\u003E\r\n    \u003Cdiv id=\"sensation-shape-options\" class=\"options-container\" style=\"display: none;\"\u003E\r\n      \u003Cb\u003EWhat has shapes?\u003C\u002Fb\u003E\u003Cbr\u003E\r\n      \u003Cdiv class=\"checkbox-group\"\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-shape-music\" name=\"sensation-shape-options\" value=\"sensation-shape-music\"\u003E\r\n        \u003Clabel for=\"sensation-shape-music\"\u003EMusic\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-shape-voices\" name=\"sensation-shape-options\" value=\"sensation-shape-voices\"\u003E\r\n        \u003Clabel for=\"sensation-shape-voices\"\u003EVoices\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-shape-noises\" name=\"sensation-shape-options\" value=\"sensation-shape-noises\"\u003E\r\n        \u003Clabel for=\"sensation-shape-noises\"\u003ENoises\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-shape-emotions\" name=\"sensation-shape-options\" value=\"sensation-shape-emotions\"\u003E\r\n        \u003Clabel for=\"sensation-shape-emotions\"\u003EEmotions\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-shape-pain\" name=\"sensation-shape-options\" value=\"sensation-shape-pain\"\u003E\r\n        \u003Clabel for=\"sensation-shape-pain\"\u003EPain\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-shape-touch\" name=\"sensation-shape-options\" value=\"sensation-shape-touch\"\u003E\r\n        \u003Clabel for=\"sensation-shape-touch\"\u003ETouch\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-shape-smells\" name=\"sensation-shape-options\" value=\"sensation-shape-smells\"\u003E\r\n        \u003Clabel for=\"sensation-shape-smells\"\u003ESmells\u003C\u002Flabel\u003E\r\n        \u003Cinput type=\"checkbox\" id=\"sensation-shape-tastes\" name=\"sensation-shape-options\" value=\"sensation-shape-tastes\"\u003E\r\n        \u003Clabel for=\"sensation-shape-tastes\"\u003ETastes\u003C\u002Flabel\u003E\r\n      \u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n   \u003Cdiv class=\"divider\"\u003E\u003C\u002Fdiv\u003E\r\n\r\n\u003Clabel for=\"language-taste\" style=\"font-size: 18px;\"\u003E\u003Cb\u003ELetters, numbers or words have tastes.\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\u003Cbr\u003E\r\n\u003Cinput type=\"radio\" id=\"language-taste_yes\" name=\"language-taste\" value=\"yes\" onclick=\"showOptions('language-taste-options')\" required\u003E\r\n\u003Clabel for=\"language-taste_yes\"\u003EYes\u003C\u002Flabel\u003E\r\n\u003Cinput type=\"radio\" id=\"language-taste_no\" name=\"language-taste\" value=\"no\" onclick=\"hideOptions('language-taste-options')\" required\u003E\r\n\u003Clabel for=\"language-taste_no\"\u003ENo\u003C\u002Flabel\u003E\u003Cbr\u003E\u003Cbr\u003E\r\n\u003Cdiv id=\"language-taste-options\" class=\"options-container\" style=\"display: none;\"\u003E\r\n  \u003Cb\u003EWhat has tastes?\u003C\u002Fb\u003E\u003Cbr\u003E\r\n  \u003Cdiv class=\"checkbox-group\"\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"language-taste-numbers\" name=\"language-taste-options\" value=\"language-taste-numbers\"\u003E\r\n    \u003Clabel for=\"language-taste-numbers\"\u003ENumbers\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"language-taste-letters\" name=\"language-taste-options\" value=\"language-taste-letters\"\u003E\r\n    \u003Clabel for=\"language-taste-letters\"\u003ELetters\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"language-taste-days\" name=\"language-taste-options\" value=\"language-taste-days\"\u003E\r\n    \u003Clabel for=\"language-taste-days\"\u003EDays of the week\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"language-taste-months\" name=\"language-taste-options\" value=\"language-taste-months\"\u003E\r\n    \u003Clabel for=\"language-taste-months\"\u003EMonths of the year\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"language-taste-names\" name=\"language-taste-options\" value=\"language-taste-names\"\u003E\r\n    \u003Clabel for=\"language-taste-names\"\u003EPeople's names\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"language-taste-english\" name=\"language-taste-options\" value=\"language-taste-english\"\u003E\r\n    \u003Clabel for=\"language-taste-english\"\u003EEnglish words\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"language-taste-nonenglish\" name=\"language-taste-options\" value=\"language-taste-nonenglish\"\u003E\r\n    \u003Clabel for=\"language-taste-nonenglish\"\u003ENon-English words\u003C\u002Flabel\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n\u003Cdiv class=\"divider\"\u003E\u003C\u002Fdiv\u003E\r\n\r\n\u003Clabel for=\"sequence-space\" style=\"font-size: 18px;\"\u003E\u003Cb\u003ESequences (e.g. time, numbers) appear in space.\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\u003Cbr\u003E\r\n\u003Cinput type=\"radio\" id=\"sequence-space_yes\" name=\"sequence-space\" value=\"yes\" onclick=\"showOptions('sequence-space-options')\" required\u003E\r\n\u003Clabel for=\"sequence-space_yes\"\u003EYes\u003C\u002Flabel\u003E\r\n\u003Cinput type=\"radio\" id=\"sequence-space_no\" name=\"sequence-space\" value=\"no\" onclick=\"hideOptions('sequence-space-options')\" required\u003E\r\n\u003Clabel for=\"sequence-space_no\"\u003ENo\u003C\u002Flabel\u003E\u003Cbr\u003E \u003Cbr\u003E\r\n\u003Cdiv id=\"sequence-space-options\" class=\"options-container\" style=\"display: none;\"\u003E\r\n  \u003Cb\u003EWhat appears in space?\u003C\u002Fb\u003E\u003Cbr\u003E\u003Cbr\u003E\r\n  \u003Ci\u003EWe are aware that you may have answered this question previously, but we would appreciate your responses being entered here too.\u003C\u002Fi\u003E\u003Cbr\u003E\u003Cbr\u003E\r\n  \u003Cdiv class=\"checkbox-group\"\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"sequence-space-numbers\" name=\"sequence-space-options\" value=\"sequence-space-numbers\"\u003E\r\n    \u003Clabel for=\"sequence-space-numbers\"\u003ENumbers\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"sequence-space-letters\" name=\"sequence-space-options\" value=\"sequence-space-letters\"\u003E\r\n    \u003Clabel for=\"sequence-space-letters\"\u003ELetters\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"sequence-space-days\" name=\"sequence-space-options\" value=\"sequence-space-days\"\u003E\r\n    \u003Clabel for=\"sequence-space-days\"\u003EDays of the week\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"sequence-space-months\" name=\"sequence-space-options\" value=\"sequence-space-months\"\u003E\r\n    \u003Clabel for=\"sequence-space-months\"\u003EMonths of the year\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"sequence-space-years\" name=\"sequence-space-options\" value=\"sequence-space-years\"\u003E\r\n    \u003Clabel for=\"sequence-space-years\"\u003EYears\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"sequence-space-temperature\" name=\"sequence-space-options\" value=\"sequence-space-temperature\"\u003E\r\n    \u003Clabel for=\"sequence-space-temperature\"\u003ETemperature\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"sequence-space-height\" name=\"sequence-space-options\" value=\"sequence-space-height\"\u003E\r\n    \u003Clabel for=\"sequence-space-height\"\u003EHeight\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"sequence-space-weight\" name=\"sequence-space-options\" value=\"sequence-space-weight\"\u003E\r\n    \u003Clabel for=\"sequence-space-weight\"\u003EWeight\u003C\u002Flabel\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n\u003Cdiv class=\"divider\"\u003E\u003C\u002Fdiv\u003E\r\n\r\n\u003Clabel for=\"personification\" style=\"font-size: 18px;\"\u003E\u003Cb\u003ELetters, numbers or words have personalities or genders.\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\u003Cbr\u003E\r\n\u003Cinput type=\"radio\" id=\"personification_yes\" name=\"personification\" value=\"yes\" onclick=\"showOptions('personification-options')\" required\u003E\r\n\u003Clabel for=\"personification_yes\"\u003EYes\u003C\u002Flabel\u003E\r\n\u003Cinput type=\"radio\" id=\"personification_no\" name=\"personification\" value=\"no\" onclick=\"hideOptions('personification-options')\" required\u003E\r\n\u003Clabel for=\"personification_no\"\u003ENo\u003C\u002Flabel\u003E\u003Cbr\u003E\u003Cbr\u003E\r\n\u003Cdiv id=\"personification-options\" class=\"options-container\" style=\"display: none;\"\u003E\r\n\r\n  \u003Cb\u003EWhich have personalities?\u003C\u002Fb\u003E\u003Cbr\u003E\r\n  \u003Cdiv class=\"checkbox-group\"\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"personification-numbers\" name=\"personification-options\" value=\"personification-numbers\"\u003E\r\n    \u003Clabel for=\"personification-numbers\"\u003ENumbers\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"personification-letters\" name=\"personification-options\" value=\"personification-letters\"\u003E\r\n    \u003Clabel for=\"personification-letters\"\u003ELetters\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"personification-days\" name=\"personification-options\" value=\"personification-days\"\u003E\r\n    \u003Clabel for=\"personification-days\"\u003EDays of the week\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"personification-months\" name=\"personification-options\" value=\"personification-months\"\u003E\r\n    \u003Clabel for=\"personification-months\"\u003EMonths of the year\u003C\u002Flabel\u003E\r\n  \u003C\u002Fdiv\u003E\r\n  \u003Cbr\u003E\r\n  \u003Cb\u003EWhich have genders?\u003C\u002Fb\u003E\u003Cbr\u003E\r\n  \u003Cdiv class=\"checkbox-group\"\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"gender-numbers\" name=\"personification-options\" value=\"gender-numbers\"\u003E\r\n    \u003Clabel for=\"gender-numbers\"\u003ENumbers\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"gender-letters\" name=\"personification-options\" value=\"gender-letters\"\u003E\r\n    \u003Clabel for=\"gender-letters\"\u003ELetters\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"gender-days\" name=\"personification-options\" value=\"gender-days\"\u003E\r\n    \u003Clabel for=\"gender-days\"\u003EDays of the week\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"gender-months\" name=\"personification-options\" value=\"gender-months\"\u003E\r\n    \u003Clabel for=\"gender-months\"\u003EMonths of the year\u003C\u002Flabel\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n\u003Cdiv class=\"divider\"\u003E\u003C\u002Fdiv\u003E\r\n\r\n\u003Clabel for=\"mirror-touch\" style=\"font-size: 18px;\"\u003E\u003Cb\u003EI feel the pain or touch of other people.\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\u003Cbr\u003E\r\n\u003Cinput type=\"radio\" id=\"mirror-touch_yes\" name=\"mirror-touch\" value=\"yes\" onclick=\"showOptions('mirror-touch-options')\" required\u003E\r\n\u003Clabel for=\"mirror-touch_yes\"\u003EYes\u003C\u002Flabel\u003E\r\n\u003Cinput type=\"radio\" id=\"mirror-touch_no\" name=\"mirror-touch\" value=\"no\" onclick=\"hideOptions('mirror-touch-options')\" required\u003E\r\n\u003Clabel for=\"mirror-touch_no\"\u003ENo\u003C\u002Flabel\u003E\u003Cbr\u003E\u003Cbr\u003E\r\n\u003Cdiv id=\"mirror-touch-options\" class=\"options-container\" style=\"display: none;\"\u003E\r\n  \u003Cb\u003EWhat do you feel?\u003C\u002Fb\u003E\u003Cbr\u003E\r\n  \u003Cdiv class=\"checkbox-group\"\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"mirror-touch-pain\" name=\"mirror-touch-options\" value=\"mirror-touch-pain\"\u003E\r\n    \u003Clabel for=\"mirror-touch-pain\"\u003EPain\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"mirror-touch-touch\" name=\"mirror-touch-options\" value=\"mirror-touch-touch\"\u003E\r\n    \u003Clabel for=\"mirror-touch-touch\"\u003ETouch\u003C\u002Flabel\u003E\r\n  \u003C\u002Fdiv\u003E\r\n  \u003Cbr\u003E\r\n  \u003Cb\u003EDo you experience touch when watching this video?\u003C\u002Fb\u003E\u003Cbr\u003E\r\n  \u003Cdiv class=\"checkbox-group\"\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"mirror-touch-video-yes\" name=\"mirror-touch-options\" value=\"mirror-touch-video-yes\"\u003E\r\n    \u003Clabel for=\"mirror-touch-video-yes\"\u003EYes\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"mirror-touch-video-no\" name=\"mirror-touch-options\" value=\"mirror-touch-video-no\"\u003E\r\n    \u003Clabel for=\"mirror-touch-video-no\"\u003ENo\u003C\u002Flabel\u003E\r\n  \u003C\u002Fdiv\u003E\r\n  \u003Cdiv class=\"video-container\"\u003E\r\n    \u003Ciframe width=\"560\" height=\"315\" src=\"https:\u002F\u002Fwww.youtube.com\u002Fembed\u002FaoUdvuLrawE?si=44OOkKbxNcnj3tgc\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen\u003E\u003C\u002Fiframe\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n\u003Cdiv class=\"divider\"\u003E\u003C\u002Fdiv\u003E\r\n\r\n\u003Clabel for=\"tickertape\" style=\"font-size: 18px;\"\u003E\u003Cb\u003EI see spoken words spelled out (like tickertape).\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\u003Cbr\u003E\r\n\u003Cinput type=\"radio\" id=\"tickertape_yes\" name=\"tickertape\" value=\"yes\" onclick=\"showOptions('tickertape-options')\" required\u003E\r\n\u003Clabel for=\"tickertape_yes\"\u003EYes\u003C\u002Flabel\u003E\r\n\u003Cinput type=\"radio\" id=\"tickertape_no\" name=\"tickertape\" value=\"no\" onclick=\"hideOptions('tickertape-options')\" required\u003E\r\n\u003Clabel for=\"tickertape_no\"\u003ENo\u003C\u002Flabel\u003E\u003Cbr\u003E\u003Cbr\u003E\r\n\u003Cdiv id=\"tickertape-options\" class=\"options-container\" style=\"display: none;\"\u003E\r\n  \u003Cb\u003EAre the spoken words coloured?\u003C\u002Fb\u003E\u003Cbr\u003E\r\n  \u003Cdiv class=\"checkbox-group\"\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"tickertape-colour-yes\" name=\"tickertape-options\" value=\"tickertape-colour-yes\"\u003E\r\n    \u003Clabel for=\"tickertape-colour-yes\"\u003EYes\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"tickertape-colour-no\" name=\"tickertape-options\" value=\"tickertape-colour-no\"\u003E\r\n    \u003Clabel for=\"tickertape-colour-no\"\u003ENo\u003C\u002Flabel\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n\u003Cdiv class=\"divider\"\u003E\u003C\u002Fdiv\u003E\r\n\r\n\u003Clabel for=\"hearing-motion\" style=\"font-size: 18px;\"\u003E\u003Cb\u003ESilently moving objects have sounds.\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\u003Cbr\u003E\r\n\u003Cinput type=\"radio\" id=\"hearing-motion_yes\" name=\"hearing-motion\" value=\"yes\" onclick=\"showOptions('hearing-motion-options')\" required\u003E\r\n\u003Clabel for=\"hearing-motion_yes\"\u003EYes\u003C\u002Flabel\u003E\r\n\u003Cinput type=\"radio\" id=\"hearing-motion_no\" name=\"hearing-motion\" value=\"no\" onclick=\"hideOptions('hearing-motion-options')\" required\u003E\r\n\u003Clabel for=\"hearing-motion_no\"\u003ENo\u003C\u002Flabel\u003E\u003Cbr\u003E\u003Cbr\u003E\r\n\u003Cdiv id=\"hearing-motion-options\" class=\"options-container\" style=\"display: none;\"\u003E\r\n  \u003Cb\u003EDo you experience sounds when watching this video?\u003C\u002Fb\u003E\u003Cbr\u003E\r\n  \u003Cdiv class=\"checkbox-group\"\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"hearing-motion-video-yes\" name=\"mirror-touch-options\" value=\"hearing-motion-video--yes\"\u003E\r\n    \u003Clabel for=\"hearing-motion-video--yes\"\u003EYes\u003C\u002Flabel\u003E\r\n    \u003Cinput type=\"checkbox\" id=\"hearing-motion-video--no\" name=\"mirror-touch-options\" value=\"hearing-motion-video-no\"\u003E\r\n    \u003Clabel for=\"hearing-motion-video-no\"\u003ENo\u003C\u002Flabel\u003E\r\n  \u003C\u002Fdiv\u003E\r\n  \u003Cdiv class=\"video-container\"\u003E\r\n    \u003Ciframe width=\"560\" height=\"315\" src=\"https:\u002F\u002Fwww.youtube.com\u002Fembed\u002Fo39TiACe4mw?si=_7QdHjn-BGuF9edl\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen\u003E\u003C\u002Fiframe\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n\u003Cdiv class=\"divider\"\u003E\u003C\u002Fdiv\u003E\r\n\r\n\u003Clabel for=\"other-types\" style=\"font-size: 18px;\"\u003E\u003Cb\u003EUsing the textbox below, please tell us about any other kinds of synaesthesia not already mentioned or feel free to clarify the answers you gave above.\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\u003Cbr\u003E\r\n\u003Cinput id=\"other-types\" maxlength=\"200\" name=\"other-types\" size=\"140\" type=\"text\" \u002F\u003E\r\n\r\n\u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n\u003Cbutton id=\"buttonSubmit\" form=\"synaesthesia-form\"\u003ENext→\u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E",
              "tardy": true
            }
          ]
        },
        {
          "type": "lab.flow.Sequence",
          "files": {},
          "responses": {},
          "parameters": {},
          "messageHandlers": {},
          "title": "Feedback_Sequence",
          "content": [
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Cheader\u003E \u003Ch1\u003E Comments \u003C\u002Fh1\u003E \u003C\u002Fheader\u003E\r\n\u003Cbr\u003E\r\n  \u003Ch3\u003E Would you like to make any final comments before ending the screening session? \u003C\u002Fh3\u003E\r\n\r\n\u003Cform\u003E\r\n\u003Ctextarea name=\"comment_feedback\" id=\"comment\" rows=\"5\" cols=\"60\"\u003E\u003C\u002Ftextarea\u003E\r\n\r\n\u003C\u002Fform\u003E",
                  "name": ""
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Feedback"
            }
          ]
        },
        {
          "type": "lab.html.Screen",
          "files": {
            "Pier_art.jpg": "embedded\u002F36767d154b4ecd1616fffb8367233dc3694fe53b2257f68a0260df62e590f82d.jpg"
          },
          "parameters": {},
          "responses": {},
          "messageHandlers": {
            "before:prepare": function anonymous(
) {
  this.options.events['click'] = function() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}
}
          },
          "title": "End_Prolific",
          "content": "\u003Cheader\u003E\r\n  \u003Ch2\u003E Thank you very much for your participation. The experiment is over. \u003C\u002Fh2\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Ch3 style=\"text-align: center; color: red;\"\u003EPlease click on this link to confirm your participation and return to the Prolific website:\u003C\u002Fh3\u003E\r\n\u003Cp style=\"text-align: center; font-size: 20;\"\u003E\u003Ca href=\"https:\u002F\u002Fapp.prolific.co\u002Fsubmissions\u002Fcomplete?cc=C17QSVNO\"\u003Ehttps:\u002F\u002Fapp.prolific.co\u002Fsubmissions\u002Fcomplete?cc=C17QSVNO\u003C\u002Fa\u003E\u003C\u002Fp\u003E\r\n\r\n\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n  \u003Csection class=\"w-l text-justify\"\u003E\r\n    \u003Cimg src=\"${ this.files[\"Pier_art.jpg\"] }\" width=\"700\"\u003E \u003C\u002Fimg\u003E\r\n    \u003Cfigcaption style=\"font-size:11px\"\u003EM Bleichner: Good Old Brighton Pier\u003C\u002Ffigcaption\u003E\r\n  \u003C\u002Fsection\u003E\r\n\u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n\r\n\u003C\u002Ffooter\u003E",
          "skip": true,
          "tardy": true
        },
        {
          "type": "lab.html.Screen",
          "files": {
            "Pier_art.jpg": "embedded\u002F36767d154b4ecd1616fffb8367233dc3694fe53b2257f68a0260df62e590f82d.jpg"
          },
          "parameters": {},
          "responses": {
            "click button#skipButton": "skipPayment",
            "click button": "submit"
          },
          "messageHandlers": {
            "after:end": function anonymous(
) {

  var paypalEmailInput = document.getElementById('paypalEmail');
  var paypalEmail = paypalEmailInput.value;
  this.state.paypalEmail = paypalEmail;



}
          },
          "title": "End_Paypal",
          "content": "  \u003Cheader\u003E\r\n    \u003Ch2\u003EThank you very much for your participation. The screening is over.\u003C\u002Fh2\u003E\r\n  \u003C\u002Fheader\u003E\r\n\r\n\u003Ch3 style=\"text-align: center; color: red;\"\u003E\r\n  Please enter your email address in the textbox below and click \"Submit\" so we can pay you via Paypal. \u003Cbr\u003EIf you would \u003Cu\u003Enot\u003C\u002Fu\u003E like payment, click the \"Skip\" button.\r\n\u003C\u002Fh3\u003E\r\n\r\n\u003Cdiv id=\"paypalDetailsBox\" style=\"text-align: center; margin-top: 20px;\"\u003E\r\n  \u003Clabel for=\"paypalEmail\" style=\"display: inline-block;\"\u003EPayPal Email:\u003C\u002Flabel\u003E\r\n  \u003Cinput type=\"text\" id=\"paypalEmail\" placeholder=\"Enter your PayPal email\" style=\"display: inline-block;\"\u003E\r\n  \u003Cp style=\"display: inline-block;\"\u003E or \u003C\u002Fp\u003E\r\n  \u003Cbutton id=\"skipButton\" onclick=\"skipPayment()\" style=\"display: inline-block;\"\u003ESkip\u003C\u002Fbutton\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n\u003Cbr\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n  \u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n\u003Cbutton id=\"buttonSubmit\"\u003ESubmit→\u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E\r\n\r\n\r\n\r\n\r\n",
          "tardy": true
        },
        {
          "type": "lab.html.Screen",
          "files": {
            "Pier_art.jpg": "embedded\u002F36767d154b4ecd1616fffb8367233dc3694fe53b2257f68a0260df62e590f82d.jpg"
          },
          "parameters": {},
          "responses": {
            "click button": "end"
          },
          "messageHandlers": {
            "before:prepare": function anonymous(
) {
  this.options.events['click'] = function() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}
}
          },
          "title": "Submit_and_close_Paypal",
          "content": "\u003Cheader style=\"color: red;\"\u003E\r\n    \u003Ch2\u003EGreat! Your payment response has been recorded.\u003C\u002Fh2\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Cp style=\"text-align: center; margin-left: auto; margin-right: auto; margin-top: 20px;\"\u003E\r\n  If you are a synaesthete, you have completed all tasks - thank you. If you are a relative, you will shortly receive an email with instructions and links to the rest of the experiment. \r\n\u003C\u002Fp\u003E\r\n\r\n \u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n    \u003Csection class=\"w-l text-justify\"\u003E\r\n      \u003Cimg src=\"${this.files[\"Pier_art.jpg\"]}\" width=\"700\" alt=\"Good Old Brighton Pier\"\u003E\r\n      \u003Cfigcaption style=\"font-size: 11px\"\u003EM Bleichner: Good Old Brighton Pier\u003C\u002Ffigcaption\u003E\r\n      \u003Cbr\u003E\r\n      \u003Ch3 style=\"text-align: center;\"\u003E You may now close the browser window. \u003C\u002Fh3\u003E\r\n    \u003C\u002Fsection\u003E\r\n  \u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n\u003Cbutton id=\"buttonSubmit\"\u003EEnd experiment→\u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E\r\n\r\n\r\n\r\n",
          "tardy": true
        }
      ]
    }
  ]
})

// Let's go!
study.run()
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
    "title": "Session_3_Final",
    "description": "Footer in feedback and motivation is better. One page for SCSQ.\n",
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
      "title": "Browser_Check",
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
                  "content": "\u003Cheader\u003E\r\n  \u003Ch1 id=\"welcomeHeader\"\u003ESession 3: Memorising Object Locations and Colours\u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "image",
                  "src": "${ this.files[\"pierre art.jpg\"] }",
                  "width": "",
                  "height": "",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "text",
                  "content": "Pierre Bonnard: The Colour of Memory (\"Window Open on the Seine\")"
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {
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

// Enable scrolling on the body element
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
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Prolific_or_Link"
            },
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "type": "text",
                  "title": "\u003Cheader\u003E \u003Ch1\u003E Information \u003C\u002Fheader\u003E \u003C\u002Fh1\u003E",
                  "content": "\u003Cp\u003E This final session will take approximately \u003Cb\u003E 60 minutes \u003C\u002Fb\u003E to complete. Please follow all instructions carefully. \u003C\u002Fp\u003E\n    \n \u003Cp\u003EDuring this study, we will ask you to complete a computerised task where you have to memorise the colour and location of an array of objects. We will measure your ability to discriminate between different colours and locations and at the same time we will test your memory for colour and location. We will also ask you to complete short questionnaires about your thinking style and motivation. The study will take approximately 1 hour and we can pay you for your time. \u003C\u002Fp\u003E\n\n\u003Cb\u003E Please ensure that you complete this experiment using a computer. \u003C\u002Fb\u003EIf you are currently using a phone or tablet, close this window and return on a computer. \u003C\u002Fp\u003E \n\n\u003Cb\u003EDuring this task, we ask you to sit in an upright position and have the screen at arm's length at all times. We also advise you to complete this task in fullscreen to mode to ensure it runs properly on your screen. \u003C\u002Fb\u003E\u003C\u002Fp\u003E"
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
              "title": "Consent",
              "scrollTop": true
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
                  "content": "\u003Cheader\u003E \u003Ch1\u003E Participant Code \u003Ch1\u003E \u003C\u002Fheader\u003E",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "html",
                  "content": " \u003Ctable\u003E\n    \u003Cthead\u003E\n      \u003Ctr\u003E\n        \u003Ctd\u003E\n          \u003Cdiv id=\"pptID\"\u003E\n            \u003Clabel for=\"participant-id\" style=\"height: 40px; font-size: 16px\"\u003E\n              \u003Cb\u003E To ensure we provide you with the correct version of the experiment, please enter your anonymised participant code below.\u003C\u002Fb\u003E \n              \n              \u003Cp\u003EPlease enter the last letter of your first and last name and the day of the month of your birthday as the code. So, for example, if your name is John Smith and your date of birth is the 1st of March, you would input \u003Cb\u003E NH01 \u003C\u002Fb\u003E:\u003C\u002Fp\u003E\u003Cbr\u003E\n            \u003C\u002Flabel\u003E\n            \u003Cinput type=\"text\" id=\"participant-id\" name=\"participantID\" placeholder=\"ID\" style=\"height: 40px; font-size: 16px\" required pattern=\"[a-zA-Z]{2}((0[1-9])|([12][0-9])|(3[01]))\"\u003E\n\n          \u003C\u002Fdiv\u003E\n        \u003C\u002Ftd\u003E\n      \u003C\u002Ftr\u003E\n    \u003C\u002Fthead\u003E\n  \u003C\u002Ftable\u003E\n",
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
              "title": "Participant_Code",
              "width": "l",
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
                  "content": "\u003Cp  class = \"alert alter-warning\" \u003E We are interested in whether you have synaesthesia or are the relative of a synaesthete. \u003Cbr\u003E \u003Cbr\u003E \u003Cb\u003EN.B. \u003C\u002Fb\u003E If you are a relative who was notified during the screening session that you may also experience synaesthesia, please select \u003Cb\u003E Relative. \u003Cb\u003E \u003C\u002Fp\u003E\n",
                  "title": ""
                },
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Ctable\u003E\r\n  \u003Cthead\u003E\r\n    \u003Ctr\u003E\r\n      \u003Ctd\u003E\r\n        \u003Clabel for=\"group\"\u003E\u003Cb\u003EAre you a synaesthete or a relative?\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\r\n        \u003Cselect name=\"group\" required class=\"w-100\"\u003E\r\n          \u003Coption value=\"\" selected\u003E-- Study Group --\u003C\u002Foption\u003E\r\n          \u003Coption value=\"relative\"\u003ERelative\u003C\u002Foption\u003E\r\n          \u003Coption value=\"synaesthete\"\u003ESynaesthete\u003C\u002Foption\u003E\r\n        \u003C\u002Fselect\u003E\r\n        \u003Cdiv id=\"synaesthete\" style=\"display: none;\"\u003E\r\n          \u003Clabel for=\"custom-synaesthesia-input\"\u003E\u003Cb\u003E\u003Cbr\u003EPlease enter either your email address or your University of Sussex participant ID for the synaesthesia database:\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\r\n          \u003Cinput type=\"text\" id=\"custom-synaesthesia-input\" name=\"synaestheteID\" placeholder=\"Participant ID\"\u003E\r\n        \u003C\u002Fdiv\u003E\r\n      \u003Cdiv id=\"relative\" style=\"display: none;\"\u003E\r\n          \u003Clabel for=\"relative-name-email\"\u003E\u003Cb\u003EPlease enter your email address:\u003C\u002Fb\u003E\u003C\u002Flabel\u003E\r\n          \u003Cbr\u003E\r\n          \u003Cinput type=\"text\" id=\"relative-name-email\" name=\"relativeNameEmail\" placeholder=\"Name or Email\"\u003E\r\n        \u003C\u002Fdiv\u003E\r\n      \u003C\u002Ftd\u003E\r\n    \u003C\u002Ftr\u003E\r\n  \u003C\u002Fthead\u003E\r\n\u003C\u002Ftable\u003E\r\n\r\n",
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
              "skip": "${this.state.Link_origin != 1}",
              "tardy": true
            },
            {
              "type": "lab.flow.Sequence",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "Scaling_Sequence",
              "scrollTop": true,
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
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Cheader\u003E\u003Ch1\u003E Great, thank you very much for providing us with that information and for ensuring that all materials are correctly scaled! \u003C\u002Fh1\u003E\u003C\u002Fheader\u003E\r\n\r\n\u003Cp class = \"alert alter-warning\" \u003E We will now provide a recap of the task instructions. Please note that this is a difficult experiment and \u003Cb\u003E you are not expected to get all the answers correct. \u003C\u002Fb\u003E Please just do your best and take breaks as needed. \u003C\u002Fp\u003E\r\n\r\n\r\n\r\n",
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
                "before:prepare": function anonymous(
) {
const ID_filtered_data = this.options.datastore.data.filter(
  row => row.sender === 'Participant_Code'
);

// Ensure there is exactly one participant in the filtered data
if (ID_filtered_data.length === 1) {
  // Extract the participantID from the single participant in the filtered data
  const participantID = ID_filtered_data[0].participantID;

  // Extract the last digit of the participantID using the pattern [a-zA-Z]{4}\d{2}
  const lastDigit = parseInt(participantID.slice(-1), 10);

  // Determine the counterbalancing value based on the last digit being odd or even
  const counterbalancing = lastDigit % 2 === 1 ? 1 : 2;

  this.parameters.counterbalancing = counterbalancing;
  this.data.counterbalancing = counterbalancing;
}
}
              },
              "title": "Counterbalancing",
              "width": "l",
              "tardy": true
            },
            {
              "type": "lab.flow.Loop",
              "templateParameters": [
                {
                  "block": 0
                }
              ],
              "sample": {
                "mode": "sequential",
                "n": ""
              },
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {
                "before:prepare": function anonymous(
) {
this.parameters.block_n = 0
this.parameters.repetition = 0

this.parameters.practice = "yes"
}
              },
              "title": "Instructions_Loop",
              "tardy": true,
              "shuffleGroups": [
                [
                  "block"
                ]
              ],
              "template": {
                "type": "lab.flow.Sequence",
                "files": {},
                "responses": {},
                "parameters": {},
                "messageHandlers": {
                  "before:prepare": function anonymous(
) {
//prepare parameters that can be used later (therefore in state, not parameters) 

// prepare presentation of wheel (for location and color)
// radius for circles
this.state.radius  = window.scaling_rectx 
this.state.radius1 =  this.state.radius - 1 
this.state.radius2 =  this.state.radius - 20
this.state.radius3 =  this.state.radius - 21 // if you make this subtracted number larger, the grey area should increase

this.state.diameter = this.state.radius * 2

// prepare image size
this.state.imgHeight =  window.scaling_rectx * 0.6 // we present image squared, so this is enough
// this.state.imgWidth = 180

// shift the image position by this value (so it is relative to the center of the circles)
this.state.imgShift = this.state.radius - this.state.imgHeight/2

}
                },
                "title": "Task_Sequence",
                "content": [
                  {
                    "type": "lab.flow.Sequence",
                    "files": {},
                    "responses": {},
                    "parameters": {},
                    "messageHandlers": {},
                    "title": "Instructions_Sequence",
                    "content": [
                      {
                        "type": "lab.html.Page",
                        "items": [
                          {
                            "required": true,
                            "type": "html",
                            "content": "\u003Cheader\u003E\r\n  \u003Ch1 id=\"instructionHeader\"\u003ETask Instructions \u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Cp class = \"alert alter-warning\" \u003E You will see either one, three or five objects on the screen at a time for two seconds. After a short break, for each object, you will then be asked to set the location and the colour that you remember. Please try to do this as accurately as possible.\u003C\u002Fp\u003E\r\n",
                            "name": ""
                          },
                          {
                            "required": true,
                            "type": "text",
                            "content": "You can change the object's location by dragging it to the desired position on the circle. If you keep the mouse button pressed and move the mouse along the circle, the location changes. When you are satisfied with the location setting, you can click on \"Confirm and continue\" to confirm the location.",
                            "title": "Setting the Location"
                          },
                          {
                            "required": true,
                            "type": "text",
                            "content": "You can change the colour by clicking with the mouse pointer on the circle surrounding the object. If you keep the mouse button pressed and move the mouse along the circle, the hue changes. When you are satisfied with the colour setting, you can click on \"Confirm and continue\" to confirm the colour.",
                            "title": "Setting the Colour"
                          }
                        ],
                        "scrollTop": true,
                        "submitButtonText": "Next→",
                        "submitButtonPosition": "right",
                        "files": {},
                        "responses": {
                          "click button": ""
                        },
                        "parameters": {},
                        "messageHandlers": {},
                        "title": "Written_Instructions_LC",
                        "width": "l",
                        "skip": "${this.state.counterbalancing != 1}"
                      },
                      {
                        "type": "lab.html.Page",
                        "items": [
                          {
                            "required": true,
                            "type": "html",
                            "content": "\u003Cheader\u003E\r\n  \u003Ch1 id=\"instructionHeader\"\u003ETask Instructions \u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Cp class = \"alert alter-warning\" \u003E You will see either \u003Cb\u003E one, three or five objects \u003C\u002Fb\u003E on the screen at a time for two seconds. After a short break, for each object, you will then be asked to set the colour and the location that you remember. Please try to do this as accurately as possible.\u003C\u002Fp\u003E\r\n",
                            "name": ""
                          },
                          {
                            "required": true,
                            "type": "text",
                            "content": "You can change the colour by clicking with the mouse pointer on the circle surrounding the object. If you keep the mouse button pressed and move the mouse along the circle, the hue changes. When you are satisfied with the colour setting, you can click on \"Confirm and continue\" to confirm the colour.",
                            "title": "Setting the Colour"
                          },
                          {
                            "required": true,
                            "type": "text",
                            "content": "You can change the object's location by dragging it to the desired position on the circle. If you keep the mouse button pressed and move the mouse along the circle, the location changes. When you are satisfied with the location setting, you can click on \"Confirm and continue\" to confirm the location.",
                            "title": "Setting the Location"
                          }
                        ],
                        "scrollTop": true,
                        "submitButtonText": "Next→",
                        "submitButtonPosition": "right",
                        "files": {},
                        "responses": {
                          "click button": ""
                        },
                        "parameters": {},
                        "messageHandlers": {},
                        "title": "Written_Instructions_CL",
                        "width": "l",
                        "skip": "${this.state.counterbalancing != 2}"
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        {
          "type": "lab.html.Page",
          "items": [
            {
              "required": true,
              "type": "html",
              "content": "\u003Cheader\u003E\r\n  \u003Ch1 id=\"instructionHeader\"\u003EMemory Test\u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E\r\n\u003Cp style=\"font-size: 24px; text-align: center;\"\u003E You are about to begin the short-term memory test blocks. There are three blocks with 15 trials each in total. \u003C\u002Fp\u003E \r\n\r\n\u003Cdiv class=\"alert\" style=\"font-size: 24px; text-align: center; white-space: nowrap;\"\u003E\r\n  &nbsp;&nbsp;In Block 1, you will see the objects one-at-a-time.\u003Cbr\u003E\r\n  &nbsp;&nbsp;&nbsp;In Block 2, you will see objects in groups of three.\u003Cbr\u003E\r\n  In Block 3, you will see objects in groups of five.  \u003Cbr\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n\u003Cp style=\"font-size: 24px; text-align: center;\"\u003EWe ask about the location and colour of every object presented on screen. You will get breaks between blocks.\u003C\u002Fp\u003E\r\n\r\n\u003Cp style=\"font-size: 24px; text-align: center;\"\u003EClick \"Start\" to begin.\u003C\u002Fp\u003E\r\n",
              "name": ""
            }
          ],
          "scrollTop": true,
          "submitButtonText": "Start→",
          "submitButtonPosition": "right",
          "files": {},
          "responses": {},
          "parameters": {},
          "messageHandlers": {},
          "title": "Block_Title",
          "width": "l"
        },
        {
          "type": "lab.flow.Loop",
          "templateParameters": [
            {
              "trial": 1
            },
            {
              "trial": 2
            },
            {
              "trial": 3
            },
            {
              "trial": 4
            },
            {
              "trial": 5
            },
            {
              "trial": 6
            },
            {
              "trial": 7
            },
            {
              "trial": 8
            },
            {
              "trial": 9
            },
            {
              "trial": 10
            },
            {
              "trial": 11
            },
            {
              "trial": 12
            },
            {
              "trial": 13
            },
            {
              "trial": 14
            },
            {
              "trial": 15
            }
          ],
          "sample": {
            "mode": "draw",
            "n": ""
          },
          "files": {},
          "responses": {},
          "parameters": {},
          "messageHandlers": {},
          "title": "Load_1",
          "shuffleGroups": [],
          "template": {
            "type": "lab.flow.Sequence",
            "files": {},
            "responses": {},
            "parameters": {},
            "messageHandlers": {
              "before:prepare": function anonymous(
) {
//prepare parameters that can be used later (therefore in state, not parameters) 

// prepare presentation of wheel (for location and color)
// radius for circles
this.state.radius  = window.scaling_rectx 
this.state.radius1 =  this.state.radius - 1 
this.state.radius2 =  this.state.radius - 20
this.state.radius3 =  this.state.radius - 21 // if you make this subtracted number larger, the grey area should increase

this.state.diameter = this.state.radius * 2

// prepare image size
this.state.imgHeight = window.scaling_rectx * 0.6 // we present image squared, so this is enough
// this.state.imgWidth = 180

// shift the image position by this value (so it is relative to the center of the circles)
this.state.imgShift = this.state.radius - this.state.imgHeight/2


}
            },
            "title": "Sequence",
            "content": [
              {
                "type": "lab.flow.Loop",
                "templateParameters": [
                  {
                    "trial_n": "1",
                    "block_n": "1",
                    "load_n": "1",
                    "image1": "image_95.png",
                    "hue1": "97",
                    "theta1": "289"
                  },
                  {
                    "trial_n": "2",
                    "block_n": "1",
                    "load_n": "1",
                    "image1": "image_96.png",
                    "hue1": "241",
                    "theta1": "313"
                  },
                  {
                    "trial_n": "3",
                    "block_n": "1",
                    "load_n": "1",
                    "image1": "image_97.png",
                    "hue1": "121",
                    "theta1": "1"
                  },
                  {
                    "trial_n": "4",
                    "block_n": "1",
                    "load_n": "1",
                    "image1": "image_98.png",
                    "hue1": "169",
                    "theta1": "25"
                  },
                  {
                    "trial_n": "5",
                    "block_n": "1",
                    "load_n": "1",
                    "image1": "image_99.png",
                    "hue1": "73",
                    "theta1": "217"
                  },
                  {
                    "trial_n": "6",
                    "block_n": "1",
                    "load_n": "1",
                    "image1": "image_100.png",
                    "hue1": "265",
                    "theta1": "265"
                  },
                  {
                    "trial_n": "7",
                    "block_n": "1",
                    "load_n": "1",
                    "image1": "image_101.png",
                    "hue1": "1",
                    "theta1": "241"
                  },
                  {
                    "trial_n": "8",
                    "block_n": "1",
                    "load_n": "1",
                    "image1": "image_102.png",
                    "hue1": "193",
                    "theta1": "97"
                  },
                  {
                    "trial_n": "9",
                    "block_n": "1",
                    "load_n": "1",
                    "image1": "image_103.png",
                    "hue1": "217",
                    "theta1": "193"
                  },
                  {
                    "trial_n": "10",
                    "block_n": "1",
                    "load_n": "1",
                    "image1": "image_104.png",
                    "hue1": "289",
                    "theta1": "121"
                  },
                  {
                    "trial_n": "11",
                    "block_n": "1",
                    "load_n": "1",
                    "image1": "image_105.png",
                    "hue1": "145",
                    "theta1": "73"
                  },
                  {
                    "trial_n": "12",
                    "block_n": "1",
                    "load_n": "1",
                    "image1": "image_106.png",
                    "hue1": "49",
                    "theta1": "337"
                  },
                  {
                    "trial_n": "13",
                    "block_n": "1",
                    "load_n": "1",
                    "image1": "image_107.png",
                    "hue1": "25",
                    "theta1": "49"
                  },
                  {
                    "trial_n": "14",
                    "block_n": "1",
                    "load_n": "1",
                    "image1": "image_108.png",
                    "hue1": "313",
                    "theta1": "169"
                  },
                  {
                    "trial_n": "15",
                    "block_n": "1",
                    "load_n": "1",
                    "image1": "image_109.png",
                    "hue1": "337",
                    "theta1": "145"
                  }
                ],
                "sample": {
                  "mode": "sequential",
                  "n": "1"
                },
                "files": {},
                "responses": {},
                "parameters": {},
                "messageHandlers": {
                  "before:prepare": function anonymous(
) {
this.options.templateParameters = this.options.templateParameters.filter(row => row.trial_n == this.parameters.trial)
}
                },
                "title": "Encoding_Loop_load_1",
                "indexParameter": "counter",
                "shuffleGroups": [],
                "template": {
                  "type": "lab.flow.Sequence",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Encoding_Sequence",
                  "content": [
                    {
                      "type": "lab.html.Screen",
                      "files": {},
                      "responses": {},
                      "parameters": {},
                      "messageHandlers": {
                        "run": function anonymous(
) {
this.state.imgHeight

// transform the deg to radians (because of Math.cos and Math.sin)
var theta1 = this.parameters.theta1 * Math.PI/180;
var theta2 = this.parameters.theta2 * Math.PI/180;
var theta3 = this.parameters.theta3 * Math.PI/180;
var theta4 = this.parameters.theta4 * Math.PI/180;
var theta5 = this.parameters.theta5 * Math.PI/180;

// calculate x and y coordinates. coordinates are shifted in relation to center of the viewbox / circle and corresponding to center of the image
var xPos = (this.state.radius * Math.cos(theta1)) + this.state.imgShift;
var yPos = (this.state.radius * Math.sin(theta1)) + this.state.imgShift;

var xPos2 = (this.state.radius * Math.cos(theta2)) + this.state.imgShift;
var yPos2 = (this.state.radius * Math.sin(theta2)) + this.state.imgShift;

var xPos3 = (this.state.radius * Math.cos(theta3)) + this.state.imgShift;
var yPos3 = (this.state.radius * Math.sin(theta3)) + this.state.imgShift;

var xPos4 = (this.state.radius * Math.cos(theta4)) + this.state.imgShift;
var yPos4 = (this.state.radius * Math.sin(theta4)) + this.state.imgShift;

var xPos5 = (this.state.radius * Math.cos(theta5)) + this.state.imgShift;
var yPos5 = (this.state.radius * Math.sin(theta5)) + this.state.imgShift;

// save coordinates
this.options.datastore.set('imgPosX', xPos);
this.options.datastore.set('imgPosY', yPos);

this.options.datastore.set('imgPosX', xPos2);
this.options.datastore.set('imgPosY', yPos2);

this.options.datastore.set('imgPosX', xPos3);
this.options.datastore.set('imgPosY', yPos3);

this.options.datastore.set('imgPosX', xPos4);
this.options.datastore.set('imgPosY', yPos4);

this.options.datastore.set('imgPosX', xPos5);
this.options.datastore.set('imgPosY', yPos5);

// set image positions and visibility
var image1 = document.getElementById('image1');
if (this.parameters.image1) {
  image1.style.left = xPos + 'px';
  image1.style.top = yPos + 'px';
  image1.style.visibility = 'visible';
} else {
  image1.style.visibility = 'hidden';
}

var image2 = document.getElementById('image2');
if (this.parameters.image2) {
  image2.style.left = xPos2 + 'px';
  image2.style.top = yPos2 + 'px';
  image2.style.visibility = 'visible';
} else {
  image2.style.visibility = 'hidden';
}

var image3 = document.getElementById('image3');
if (this.parameters.image3) {
  image3.style.left = xPos3 + 'px';
  image3.style.top = yPos3 + 'px';
  image3.style.visibility = 'visible';
} else {
  image3.style.visibility = 'hidden';
}

var image4 = document.getElementById('image4');
if (this.parameters.image4) {
  image4.style.left = xPos4 + 'px';
  image4.style.top = yPos4 + 'px';
  image4.style.visibility = 'visible';
} else {
  image4.style.visibility = 'hidden';
}

var image5 = document.getElementById('image5');
if (this.parameters.image5) {
  image5.style.left = xPos5 + 'px';
  image5.style.top = yPos5 + 'px';
  image5.style.visibility = 'visible';
} else {
  image5.style.visibility = 'hidden';
}

}
                      },
                      "title": "Encoding_Screen",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n\r\n  \u003Cdiv class = \"pickparent\" style= \"\"\u003E\r\n     \u003Csvg class=\"pickpicker\"\r\n          height =\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" \r\n          viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\r\n          \u003C!–– keep scaling similar for object with: preserveAspectRatio =\"xMinYMin meet\", put it back bfore viewbox if needed --\u003E\r\n       \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\r\n          style=\"fill: #f2f2f2\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \r\n          style=\"fill: white\"\r\n        \u002F\u003E\r\n      \u003C\u002Fsvg\u003E\r\n\r\n      \u003Cimg id=\"image1\" class='pickimage' src=\"static\u002F${this.parameters.image1}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue1}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image2\" class='pickimage' src=\"static\u002F${this.parameters.image2}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue2}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image3\" class='pickimage' src=\"static\u002F${this.parameters.image3}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue3}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image4\" class='pickimage' src=\"static\u002F${this.parameters.image4}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue4}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image5\" class='pickimage' src=\"static\u002F${this.parameters.image5}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue5}deg)'\u003E\r\n\r\n  \u003C\u002Fdiv\u003E\r\n\r\n\u003C\u002Fmain\u003E\r\n\r\n  \u003Cfooter\u003E\r\n  \u003Cp id=\"fwd\"\u003E\r\n \r\n  \u003C\u002Fp\u003E\r\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\r\n    I'm just here for similar footer\r\n\u003Cbr\u003E\r\n\u003Cbr\u003E\r\n\u003Cbr\u003E\r\n  \u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E\r\n\r\n\r\n\r\n",
                      "tardy": true,
                      "timeout": "3000"
                    }
                  ]
                }
              },
              {
                "type": "lab.flow.Loop",
                "templateParameters": [
                  {
                    "trial_n": "1",
                    "block_n": "1",
                    "load_n": "1",
                    "image": "image_95.png",
                    "hue": "97",
                    "theta": "289"
                  },
                  {
                    "trial_n": "2",
                    "block_n": "1",
                    "load_n": "1",
                    "image": "image_96.png",
                    "hue": "241",
                    "theta": "313"
                  },
                  {
                    "trial_n": "3",
                    "block_n": "1",
                    "load_n": "1",
                    "image": "image_97.png",
                    "hue": "121",
                    "theta": "1"
                  },
                  {
                    "trial_n": "4",
                    "block_n": "1",
                    "load_n": "1",
                    "image": "image_98.png",
                    "hue": "169",
                    "theta": "25"
                  },
                  {
                    "trial_n": "5",
                    "block_n": "1",
                    "load_n": "1",
                    "image": "image_99.png",
                    "hue": "73",
                    "theta": "217"
                  },
                  {
                    "trial_n": "6",
                    "block_n": "1",
                    "load_n": "1",
                    "image": "image_100.png",
                    "hue": "265",
                    "theta": "265"
                  },
                  {
                    "trial_n": "7",
                    "block_n": "1",
                    "load_n": "1",
                    "image": "image_101.png",
                    "hue": "1",
                    "theta": "241"
                  },
                  {
                    "trial_n": "8",
                    "block_n": "1",
                    "load_n": "1",
                    "image": "image_102.png",
                    "hue": "193",
                    "theta": "97"
                  },
                  {
                    "trial_n": "9",
                    "block_n": "1",
                    "load_n": "1",
                    "image": "image_103.png",
                    "hue": "217",
                    "theta": "193"
                  },
                  {
                    "trial_n": "10",
                    "block_n": "1",
                    "load_n": "1",
                    "image": "image_104.png",
                    "hue": "289",
                    "theta": "121"
                  },
                  {
                    "trial_n": "11",
                    "block_n": "1",
                    "load_n": "1",
                    "image": "image_105.png",
                    "hue": "145",
                    "theta": "73"
                  },
                  {
                    "trial_n": "12",
                    "block_n": "1",
                    "load_n": "1",
                    "image": "image_106.png",
                    "hue": "49",
                    "theta": "337"
                  },
                  {
                    "trial_n": "13",
                    "block_n": "1",
                    "load_n": "1",
                    "image": "image_107.png",
                    "hue": "25",
                    "theta": "49"
                  },
                  {
                    "trial_n": "14",
                    "block_n": "1",
                    "load_n": "1",
                    "image": "image_108.png",
                    "hue": "313",
                    "theta": "169"
                  },
                  {
                    "trial_n": "15",
                    "block_n": "1",
                    "load_n": "1",
                    "image": "image_109.png",
                    "hue": "337",
                    "theta": "145"
                  }
                ],
                "sample": {
                  "mode": "sequential",
                  "n": ""
                },
                "files": {},
                "responses": {},
                "parameters": {},
                "messageHandlers": {
                  "before:prepare": function anonymous(
) {
this.parameters.practice = "no"

this.options.templateParameters = this.options.templateParameters.filter(row => row.trial_n == this.parameters.trial)
}
                },
                "title": "Recall_Loop_load_1",
                "shuffleGroups": [],
                "template": {
                  "type": "lab.flow.Sequence",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Recall_Sequence_load_1",
                  "content": [
                    {
                      "type": "lab.html.Screen",
                      "files": {},
                      "responses": {},
                      "parameters": {},
                      "messageHandlers": {},
                      "title": "Retention_interval",
                      "timeout": "1000"
                    },
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
// prepare modulus function
Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
}

// no picking when mouse is not active
let isPicking = false

// introduce global variable for button visibility state
let isButtonVisible = false

// function to get position during mousedown. set picking to active
this.options.events['mousedown'] = function (e) {
  isPicking = true // need to get position already here
  offsetX = document.getElementById('previewL').offsetLeft - e.clientX
  offsetY = document.getElementById('previewL').offsetTop - e.clientY
}

// when mouse is released, picking is not active again
this.options.events['mouseup'] = function () {
  isPicking = false
}

// what happens when mouse is moving over the grey circle area
this.options.events['mousemove #locationCircle'] = function (event) {
  if (isPicking) {

    // set position of image to where the mouse is. it is for upper left corner of the image.
    document.getElementById('previewL').style.left = (event.clientX + offsetX) + "px"
    document.getElementById('previewL').style.top = (event.clientY + offsetY) + "px"

    // we need to take the relation to circle and take the center of object (now we subtract)
    this.parameters.imgPosXTest = (event.clientX + offsetX) - this.state.imgShift
    this.parameters.imgPosYTest = (event.clientY + offsetY) - this.state.imgShift

    // use pythagoras theorem to check for image movement on circle
    let imageRadius = Math.sqrt(Math.pow(this.parameters.imgPosXTest, 2) + Math.pow(this.parameters.imgPosYTest, 2));

    // set parameter for button visibility
    if (imageRadius > 120) {
      if (!isButtonVisible) {
        // I want the continue button to show.
        setVisibility('#cmt', true)
      }
    } else {
      if (isButtonVisible) {
        // I dont want the continue button to show.
        setVisibility('#cmt', false)
      }
    }

    // calculate angle in radians
    const locAngleRadians = Math.atan2(this.parameters.imgPosYTest, this.parameters.imgPosXTest)

    // transform from radians to degrees
    const locAngleDegrees = locAngleRadians * 180 / Math.PI

    // save location adjustments etc NOTE: IF YOU HAVE TWO COMPONENTS FOR LOCATION AND COLOUR, YOU COULD HAVE THE SAME VARIABLE NAMES. THEN IT WOULD BE SAVED IN THE SAME COLUMN BUT YOU CAN FILTER AFTER THE NAME OF THE COMPONENT LATER. YOU CAN ALSO FILTER FOR COMPONENT WHEN READING IT OUT OF THE DATASTORE FOR FEEDBACK LATER. 
    this.data.location_angle_study = this.parameters.theta
    this.data.location_angle_test = locAngleDegrees
    this.data.location_angle_deviation = (((this.data.location_angle_study - this.data.location_angle_test) + 180).mod(360)) - 180
    this.data.location_angle_abs_deviation = Math.abs(this.data.location_angle_deviation)
  }
}

// show forward button only when location adjustment has been made
const setVisibility = (selector, isVisible) => {
  // extract the content from the current element
  const target = this.options.el.querySelector(selector)
  target.style.visibility = isVisible ? 'visible' : 'hidden'
  isButtonVisible = isVisible ? true : false
}



},
                        "run": function anonymous(
) {
// present object in center at the beginning
document.getElementById('previewL').style.top  =  0 + this.state.imgShift  + "px"
document.getElementById('previewL').style.left =  0 + this.state.imgShift  + "px"

  

}
                      },
                      "title": "Location_Recall_STM1",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\n\n    \u003Cdiv class = \"pickparent\" style= \"\"\u003E\n         \u003Csvg class='pickpicker' height=\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\n        \n          \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\n          style=\"fill: #f2f2f2\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \n          style=\"fill: white\"\n        \u002F\u003E\n      \u003C\u002Fsvg\u003E\n    \n     \u003Cimg class='pickimage'id=\"previewL\" src=\"static\u002F${this.parameters.image}\"      \n       style = 'height: ${this.state.imgHeight + \"px\"}; pointer-events: none;'\u003E\n\n\n    \u003C\u002Fdiv\u003E\n\n\u003C\u002Fmain\u003E\n\n\u003Cfooter\u003E\n  \u003Cp id=\"fwd\"\u003E\n  Keep left mouse button pressed and move object to set LOCATION on circle.\n  \u003C\u002Fp\u003E\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\n    Confirm selected LOCATION and continue\n  \u003C\u002Fbutton\u003E\n\u003C\u002Ffooter\u003E",
                      "tardy": true,
                      "skip": "${this.state.counterbalancing != 1}"
                    },
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
Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
}

let isPicking = false

// set dummy to hide / present button
let dummy_button = 999

this.options.events['mousedown'] = function() {
  isPicking = true
}

this.options.events['mouseup'] = function() {
  isPicking = false
}

// create random offset between -180 and +180
offset = Math.random() * 360 -180

this.options.events['mousemove #colorCircle'] = function(event) {
  if (isPicking) {
    // extract click coordinates from event,
    // and make them relative to the circle center by subtracting radius-imgHeight
    this.parameters.colX = event.offsetX - this.state.imgShift 
    this.parameters.colY = event.offsetY - this.state.imgShift 

    // compute angle
    const angleRadians = Math.atan2(this.parameters.colY, this.parameters.colX)

    // transform from radians to degrees
    const angleDegrees = angleRadians * 180 / Math.PI

    // randomly shift location of colors on color circle
    const colorAngle = (((angleDegrees + offset) + 180).mod(360)) - 180

    // apply color to preview image using hue-rotate
    const preview = this.options.el.querySelector('#preview')
    preview.style.filter = `hue-rotate(${ colorAngle }deg)`
    
    // note that mouse was moved to show button
    dummy_button = 1
    
    // save color adjustments etc. IF YOU HAVE TWO COMPONENTS FOR LOCATION AND COLOUR, YOU COULD HAVE THE SAME VARIABLE NAMES. THEN IT WOULD BE SAVED IN THE SAME COLUMN BUT YOU CAN FILTER AFTER THE NAME OF THE COMPONENT LATER. YOU CAN ALSO FILTER FOR COMPONENT WHEN READING IT OUT OF THE DATASTORE FOR FEEDBACK LATER. 
    this.data.color_offset = offset
    this.data.color_angle_study = this.parameters.hue
    this.data.color_angle_test = colorAngle
    this.data.color_angle_deviation = (((this.data.color_angle_study - this.data.color_angle_test) + 180).mod(360)) - 180
    this.data.color_angle_abs_deviation = Math.abs(this.data.color_angle_deviation)

  }

}

// show forward button only when color adjustment has been made

const setVisibility = (selector, isVisible) => {
  // Extract the content from the current element
  const target = this.options.el.querySelector(selector)
  target.style.visibility = isVisible ? 'visible' : 'hidden'
}

this.options.events['mousemove'] = function(){ 
// make sure a color has been selected
if(dummy_button != 999) {
  setVisibility('#cmt', true) // make sure that button is visible
  }
}
},
                        "run": function anonymous(
) {
// present image in center 
document.getElementById('preview').style.top  =  0 + this.state.imgShift + "px"
document.getElementById('preview').style.left =  0 + this.state.imgShift + "px"

}
                      },
                      "title": "Colour_Recall_STM1",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n\r\n    \u003Cdiv class='pickparent' style=''\u003E\r\n      \u003Csvg class='pickpicker' height=\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\r\n        \r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\r\n          style=\"fill: #f2f2f2\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \r\n          style=\"fill: white\"\r\n        \u002F\u003E\r\n      \u003C\u002Fsvg\u003E\r\n      \u003Cimg class='pickimage' id=\"preview\" src='static\u002F${this.parameters.image}' style = 'height: ${this.state.imgHeight + \"px\"}; pointer-events: none;'\u003E  \r\n    \u003C\u002Fdiv\u003E\r\n\r\n\u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n  \u003Cp id=\"fwd\"\u003E\r\n  Keep left mouse button pressed and move mouse over circle to set COLOUR.\r\n  \u003C\u002Fp\u003E\r\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\r\n    Confirm selected COLOUR and continue\r\n  \u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E",
                      "tardy": true
                    },
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
// prepare modulus function
Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
}

// no picking when mouse is not active
let isPicking = false

// introduce global variable for button visibility state
let isButtonVisible = false

// function to get position during mousedown. set picking to active
this.options.events['mousedown'] = function (e) {
  isPicking = true // need to get position already here
  offsetX = document.getElementById('previewL').offsetLeft - e.clientX
  offsetY = document.getElementById('previewL').offsetTop - e.clientY
}

// when mouse is released, picking is not active again
this.options.events['mouseup'] = function () {
  isPicking = false
}

// what happens when mouse is moving over the grey circle area
this.options.events['mousemove #locationCircle'] = function (event) {
  if (isPicking) {

    // set position of image to where the mouse is. it is for upper left corner of the image.
    document.getElementById('previewL').style.left = (event.clientX + offsetX) + "px"
    document.getElementById('previewL').style.top = (event.clientY + offsetY) + "px"

    // we need to take the relation to circle and take the center of object (now we subtract)
    this.parameters.imgPosXTest = (event.clientX + offsetX) - this.state.imgShift
    this.parameters.imgPosYTest = (event.clientY + offsetY) - this.state.imgShift

    // use pythagoras theorem to check for image movement on circle
    let imageRadius = Math.sqrt(Math.pow(this.parameters.imgPosXTest, 2) + Math.pow(this.parameters.imgPosYTest, 2));

    // set parameter for button visibility
    if (imageRadius > 120) {
      if (!isButtonVisible) {
        // I want the continue button to show.
        setVisibility('#cmt', true)
      }
    } else {
      if (isButtonVisible) {
        // I dont want the continue button to show.
        setVisibility('#cmt', false)
      }
    }

    // calculate angle in radians
    const locAngleRadians = Math.atan2(this.parameters.imgPosYTest, this.parameters.imgPosXTest)

    // transform from radians to degrees
    const locAngleDegrees = locAngleRadians * 180 / Math.PI

    // save location adjustments etc NOTE: IF YOU HAVE TWO COMPONENTS FOR LOCATION AND COLOUR, YOU COULD HAVE THE SAME VARIABLE NAMES. THEN IT WOULD BE SAVED IN THE SAME COLUMN BUT YOU CAN FILTER AFTER THE NAME OF THE COMPONENT LATER. YOU CAN ALSO FILTER FOR COMPONENT WHEN READING IT OUT OF THE DATASTORE FOR FEEDBACK LATER. 
    this.data.location_angle_study = this.parameters.theta
    this.data.location_angle_test = locAngleDegrees
    this.data.location_angle_deviation = (((this.data.location_angle_study - this.data.location_angle_test) + 180).mod(360)) - 180
    this.data.location_angle_abs_deviation = Math.abs(this.data.location_angle_deviation)
  }
}

// show forward button only when location adjustment has been made
const setVisibility = (selector, isVisible) => {
  // extract the content from the current element
  const target = this.options.el.querySelector(selector)
  target.style.visibility = isVisible ? 'visible' : 'hidden'
  isButtonVisible = isVisible ? true : false
}



},
                        "run": function anonymous(
) {
// present object in center at the beginning
document.getElementById('previewL').style.top  =  0 + this.state.imgShift  + "px"
document.getElementById('previewL').style.left =  0 + this.state.imgShift  + "px"

  

}
                      },
                      "title": "Location_Recall_STM1",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\n\n    \u003Cdiv class = \"pickparent\" style= \"\"\u003E\n         \u003Csvg class='pickpicker' height=\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\n        \n          \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\n          style=\"fill: #f2f2f2\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \n          style=\"fill: white\"\n        \u002F\u003E\n      \u003C\u002Fsvg\u003E\n    \n     \u003Cimg class='pickimage'id=\"previewL\" src=\"static\u002F${this.parameters.image}\"      \n       style = 'height: ${this.state.imgHeight + \"px\"}; pointer-events: none;'\u003E\n\n\n    \u003C\u002Fdiv\u003E\n\n\u003C\u002Fmain\u003E\n\n\u003Cfooter\u003E\n  \u003Cp id=\"fwd\"\u003E\n  Keep left mouse button pressed and move object to set LOCATION on circle.\n  \u003C\u002Fp\u003E\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\n    Confirm selected LOCATION and continue\n  \u003C\u002Fbutton\u003E\n\u003C\u002Ffooter\u003E",
                      "tardy": true,
                      "skip": "${this.state.counterbalancing != 2}"
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          "type": "lab.html.Screen",
          "files": {},
          "responses": {
            "click button": "Next"
          },
          "parameters": {},
          "messageHandlers": {
            "run": function anonymous(
) {
// Get the circle indicator elements
const locationIndicator = document.getElementById('locationIndicator');
const colorIndicator = document.getElementById('colorIndicator');

// filter by Location_Recall
const location_filtered_data = this.options.datastore.data.filter(
  row => row.sender === 'Location_Recall_STM1' && row.ended_on !== 'skipped' && row.block === this.parameters.block
);

// filter by Colour_Recall
const color_filtered_data = this.options.datastore.data.filter(
  row => row.sender === 'Colour_Recall_STM1' && row.ended_on !== 'skipped' && row.block === this.parameters.block
);

// Calculate average deviation for Location_Recall
const locationTotalRows = location_filtered_data.length;
const locationDeviationSum = location_filtered_data.reduce((sum, row) => sum + Math.abs(row.location_angle_abs_deviation), 0);
const locationAverageDeviation = locationTotalRows === 0 ? 0 : locationDeviationSum / locationTotalRows;

// Calculate average deviation for Colour_Recall
const colorTotalRows = color_filtered_data.length;
const colorDeviationSum = color_filtered_data.reduce((sum, row) => sum + Math.abs(row.color_angle_abs_deviation), 0);
const colorAverageDeviation = colorTotalRows === 0 ? 0 : colorDeviationSum / colorTotalRows;

// Take the square root of the average deviations
const sqrtLocationAverageDeviation = Math.sqrt(locationAverageDeviation);
const sqrtColorAverageDeviation = Math.sqrt(colorAverageDeviation);

// Calculate the position of the circle indicators
const locationIndicatorPosition = (sqrtLocationAverageDeviation / Math.sqrt(180)) * 100;
const colorIndicatorPosition = (sqrtColorAverageDeviation / Math.sqrt(180)) * 100;

// Set the position of the circle indicators
locationIndicator.style.left = `${locationIndicatorPosition}%`;
colorIndicator.style.left = `${colorIndicatorPosition}%`;

skillsContainer1.style.transform = "scale("+window.scaling_rectx*0.004+")";
skillsContainer2.style.transform = "scale("+window.scaling_rectx*0.004+")";



}
          },
          "title": "Block_Feedback_Screen",
          "content": " \u003Cdiv class=\"centered-container\"\u003E\r\n \u003Cdiv class=\"block-feedback\"\u003E\r\n    \u003Ch1 style=\"text-align: center; font-size: 28px;\"\u003EFeedback\u003C\u002Fh1\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\r\n  \u003Cdiv class=\"skills-container\" id=\"skillsContainer1\"\u003E\r\n    \u003Cp style = \"font-size: 28px\" id=\"fontLocation\"\u003ELocation:\u003C\u002Fp\u003E\r\n    \u003Cdiv class=\"skills-bar\"\u003E\r\n      \u003Cdiv class=\"skills-range\"\u003E\u003C\u002Fdiv\u003E\r\n      \u003Cdiv class=\"indicator-circle\" id=\"locationIndicator\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n    \u003Cp class=\"skills-label\" style=\"font-size:50px; color: green; font-weight: bold;\"\u003E&#x2713\u003C\u002Fp\u003E\r\n    \u003Cp class=\"skills-max-label\" style=\"font-size:50px; color: red; font-weight: bold;\"\u003E&#x2717\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\r\n  \u003Cdiv class=\"skills-container\" id=\"skillsContainer2\"\u003E\r\n    \u003Cp style = \"font-size: 28px\"\u003EColour:\u003C\u002Fp\u003E\r\n    \u003Cdiv class=\"skills-bar\"\u003E\r\n      \u003Cdiv class=\"skills-range\"\u003E\u003C\u002Fdiv\u003E\r\n      \u003Cdiv class=\"indicator-circle\" id=\"colorIndicator\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n    \u003Cp class=\"skills-label\" style=\"font-size:50px; color: green; font-weight: bold;\"\u003E&#x2713\u003C\u002Fp\u003E\r\n    \u003Cp class=\"skills-max-label\" style=\"font-size:50px; color: red; font-weight: bold;\"\u003E&#x2717\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n\u003Cfooter style=\"position: absolute; width: calc(100% - 2.4%); bottom: 1.2%; left: 1.2%; right: 1.2%; text-align: center;\"\u003E\r\n    \u003Cbutton id=\"buttonSubmit\"\u003ENext→\u003C\u002Fbutton\u003E\r\n  \u003C\u002Ffooter\u003E\r\n",
          "tardy": true
        },
        {
          "type": "lab.html.Page",
          "items": [
            {
              "type": "text",
              "title": "\u003Cheader\u003E \u003Ch1\u003EBreak \u003C\u002Fheader\u003E \u003C\u002Fh1\u003E",
              "content": "\u003Cdiv class= \"message\"\u003E\n\u003Cdiv\u003E\n  \u003Cspan id=\"endMessage_load1\" \u003E\u003C\u002Fspan\u003E\n\u003C\u002Fdiv\u003E\n"
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
    document.getElementById('endMessage_load1').innerHTML = "<p> Great! Take a short break before we try that again with  <b> three </b> objects on screen at a time. </p> <p> Click 'Next' when you are ready to move on. </p>";
}
          },
          "title": "Block_Break_Screen",
          "tardy": true
        },
        {
          "type": "lab.flow.Loop",
          "templateParameters": [
            {
              "trial": "16"
            },
            {
              "trial": "17"
            },
            {
              "trial": "18"
            },
            {
              "trial": "19"
            },
            {
              "trial": "20"
            },
            {
              "trial": "21"
            },
            {
              "trial": "22"
            },
            {
              "trial": "23"
            },
            {
              "trial": "24"
            },
            {
              "trial": "25"
            },
            {
              "trial": "26"
            },
            {
              "trial": "27"
            },
            {
              "trial": "28"
            },
            {
              "trial": "29"
            },
            {
              "trial": "30"
            }
          ],
          "sample": {
            "mode": "draw",
            "n": ""
          },
          "files": {},
          "responses": {},
          "parameters": {},
          "messageHandlers": {},
          "title": "Load_3",
          "shuffleGroups": [],
          "template": {
            "type": "lab.flow.Sequence",
            "files": {},
            "responses": {},
            "parameters": {},
            "messageHandlers": {
              "before:prepare": function anonymous(
) {
//prepare parameters that can be used later (therefore in state, not parameters) 

// prepare presentation of wheel (for location and color)
// radius for circles
this.state.radius  = window.scaling_rectx 
this.state.radius1 =  this.state.radius - 1 
this.state.radius2 =  this.state.radius - 20
this.state.radius3 =  this.state.radius - 21 // if you make this subtracted number larger, the grey area should increase

this.state.diameter = this.state.radius * 2

// prepare image size
this.state.imgHeight = window.scaling_rectx * 0.6 // we present image squared, so this is enough
// this.state.imgWidth = 180

// shift the image position by this value (so it is relative to the center of the circles)
this.state.imgShift = this.state.radius - this.state.imgHeight/2


}
            },
            "title": "Sequence",
            "content": [
              {
                "type": "lab.flow.Loop",
                "templateParameters": [
                  {
                    "trial_n": "16",
                    "block_n": "2",
                    "load_n": "3",
                    "image1": "image_111.png",
                    "hue1": "304",
                    "theta1": "189",
                    "image2": "image_112.png",
                    "hue2": "90",
                    "theta2": "309",
                    "image3": "image_110.png",
                    "hue3": "241",
                    "theta3": "96"
                  },
                  {
                    "trial_n": "17",
                    "block_n": "2",
                    "load_n": "3",
                    "image1": "image_114.png",
                    "hue1": "279",
                    "theta1": "120",
                    "image2": "image_113.png",
                    "hue2": "107",
                    "theta2": "14",
                    "image3": "image_115.png",
                    "hue3": "34",
                    "theta3": "241"
                  },
                  {
                    "trial_n": "18",
                    "block_n": "2",
                    "load_n": "3",
                    "image1": "image_117.png",
                    "hue1": "19",
                    "theta1": "162",
                    "image2": "image_116.png",
                    "hue2": "258",
                    "theta2": "74",
                    "image3": "image_118.png",
                    "hue3": "171",
                    "theta3": "328"
                  },
                  {
                    "trial_n": "19",
                    "block_n": "2",
                    "load_n": "3",
                    "image1": "image_120.png",
                    "hue1": "325",
                    "theta1": "129",
                    "image2": "image_121.png",
                    "hue2": "78",
                    "theta2": "303",
                    "image3": "image_119.png",
                    "hue3": "226",
                    "theta3": "66"
                  },
                  {
                    "trial_n": "20",
                    "block_n": "2",
                    "load_n": "3",
                    "image1": "image_124.png",
                    "hue1": "311",
                    "theta1": "268",
                    "image2": "image_123.png",
                    "hue2": "182",
                    "theta2": "191",
                    "image3": "image_122.png",
                    "hue3": "74",
                    "theta3": "127"
                  },
                  {
                    "trial_n": "21",
                    "block_n": "2",
                    "load_n": "3",
                    "image1": "image_127.png",
                    "hue1": "66",
                    "theta1": "274",
                    "image2": "image_126.png",
                    "hue2": "220",
                    "theta2": "211",
                    "image3": "image_125.png",
                    "hue3": "158",
                    "theta3": "28"
                  },
                  {
                    "trial_n": "22",
                    "block_n": "2",
                    "load_n": "3",
                    "image1": "image_129.png",
                    "hue1": "337",
                    "theta1": "180",
                    "image2": "image_128.png",
                    "hue2": "152",
                    "theta2": "70",
                    "image3": "image_130.png",
                    "hue3": "10",
                    "theta3": "325"
                  },
                  {
                    "trial_n": "23",
                    "block_n": "2",
                    "load_n": "3",
                    "image1": "image_131.png",
                    "hue1": "212",
                    "theta1": "40",
                    "image2": "image_132.png",
                    "hue2": "278",
                    "theta2": "179",
                    "image3": "image_133.png",
                    "hue3": "81",
                    "theta3": "285"
                  },
                  {
                    "trial_n": "24",
                    "block_n": "2",
                    "load_n": "3",
                    "image1": "image_136.png",
                    "hue1": "195",
                    "theta1": "348",
                    "image2": "image_134.png",
                    "hue2": "271",
                    "theta2": "83",
                    "image3": "image_135.png",
                    "hue3": "30",
                    "theta3": "171"
                  },
                  {
                    "trial_n": "25",
                    "block_n": "2",
                    "load_n": "3",
                    "image1": "image_138.png",
                    "hue1": "55",
                    "theta1": "216",
                    "image2": "image_139.png",
                    "hue2": "199",
                    "theta2": "336",
                    "image3": "image_137.png",
                    "hue3": "133",
                    "theta3": "54"
                  },
                  {
                    "trial_n": "26",
                    "block_n": "2",
                    "load_n": "3",
                    "image1": "image_142.png",
                    "hue1": "15",
                    "theta1": "355",
                    "image2": "image_140.png",
                    "hue2": "266",
                    "theta2": "60",
                    "image3": "image_141.png",
                    "hue3": "121",
                    "theta3": "225"
                  },
                  {
                    "trial_n": "27",
                    "block_n": "2",
                    "load_n": "3",
                    "image1": "image_143.png",
                    "hue1": "336",
                    "theta1": "88",
                    "image2": "image_144.png",
                    "hue2": "174",
                    "theta2": "167",
                    "image3": "image_145.png",
                    "hue3": "248",
                    "theta3": "344"
                  },
                  {
                    "trial_n": "28",
                    "block_n": "2",
                    "load_n": "3",
                    "image1": "image_146.png",
                    "hue1": "286",
                    "theta1": "110",
                    "image2": "image_148.png",
                    "hue2": "52",
                    "theta2": "341",
                    "image3": "image_147.png",
                    "hue3": "164",
                    "theta3": "204"
                  },
                  {
                    "trial_n": "29",
                    "block_n": "2",
                    "load_n": "3",
                    "image1": "image_151.png",
                    "hue1": "250",
                    "theta1": "298",
                    "image2": "image_149.png",
                    "hue2": "110",
                    "theta2": "10",
                    "image3": "image_150.png",
                    "hue3": "29",
                    "theta3": "136"
                  },
                  {
                    "trial_n": "30",
                    "block_n": "2",
                    "load_n": "3",
                    "image1": "image_154.png",
                    "hue1": "11",
                    "theta1": "353",
                    "image2": "image_153.png",
                    "hue2": "97",
                    "theta2": "230",
                    "image3": "image_152.png",
                    "hue3": "141",
                    "theta3": "111"
                  }
                ],
                "sample": {
                  "mode": "sequential",
                  "n": "1"
                },
                "files": {},
                "responses": {},
                "parameters": {},
                "messageHandlers": {
                  "before:prepare": function anonymous(
) {
this.options.templateParameters = this.options.templateParameters.filter(row => row.trial_n == this.parameters.trial)
}
                },
                "title": "Encoding_Loop_load_3",
                "indexParameter": "counter",
                "shuffleGroups": [],
                "template": {
                  "type": "lab.flow.Sequence",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Encoding_Sequence",
                  "content": [
                    {
                      "type": "lab.html.Screen",
                      "files": {},
                      "responses": {},
                      "parameters": {},
                      "messageHandlers": {
                        "run": function anonymous(
) {
this.state.imgHeight

// transform the deg to radians (because of Math.cos and Math.sin)
var theta1 = this.parameters.theta1 * Math.PI/180;
var theta2 = this.parameters.theta2 * Math.PI/180;
var theta3 = this.parameters.theta3 * Math.PI/180;
var theta4 = this.parameters.theta4 * Math.PI/180;
var theta5 = this.parameters.theta5 * Math.PI/180;

// calculate x and y coordinates. coordinates are shifted in relation to center of the viewbox / circle and corresponding to center of the image
var xPos = (this.state.radius * Math.cos(theta1)) + this.state.imgShift;
var yPos = (this.state.radius * Math.sin(theta1)) + this.state.imgShift;

var xPos2 = (this.state.radius * Math.cos(theta2)) + this.state.imgShift;
var yPos2 = (this.state.radius * Math.sin(theta2)) + this.state.imgShift;

var xPos3 = (this.state.radius * Math.cos(theta3)) + this.state.imgShift;
var yPos3 = (this.state.radius * Math.sin(theta3)) + this.state.imgShift;

var xPos4 = (this.state.radius * Math.cos(theta4)) + this.state.imgShift;
var yPos4 = (this.state.radius * Math.sin(theta4)) + this.state.imgShift;

var xPos5 = (this.state.radius * Math.cos(theta5)) + this.state.imgShift;
var yPos5 = (this.state.radius * Math.sin(theta5)) + this.state.imgShift;

// save coordinates
this.options.datastore.set('imgPosX', xPos);
this.options.datastore.set('imgPosY', yPos);

this.options.datastore.set('imgPosX', xPos2);
this.options.datastore.set('imgPosY', yPos2);

this.options.datastore.set('imgPosX', xPos3);
this.options.datastore.set('imgPosY', yPos3);

this.options.datastore.set('imgPosX', xPos4);
this.options.datastore.set('imgPosY', yPos4);

this.options.datastore.set('imgPosX', xPos5);
this.options.datastore.set('imgPosY', yPos5);

// set image positions and visibility
var image1 = document.getElementById('image1');
if (this.parameters.image1) {
  image1.style.left = xPos + 'px';
  image1.style.top = yPos + 'px';
  image1.style.visibility = 'visible';
} else {
  image1.style.visibility = 'hidden';
}

var image2 = document.getElementById('image2');
if (this.parameters.image2) {
  image2.style.left = xPos2 + 'px';
  image2.style.top = yPos2 + 'px';
  image2.style.visibility = 'visible';
} else {
  image2.style.visibility = 'hidden';
}

var image3 = document.getElementById('image3');
if (this.parameters.image3) {
  image3.style.left = xPos3 + 'px';
  image3.style.top = yPos3 + 'px';
  image3.style.visibility = 'visible';
} else {
  image3.style.visibility = 'hidden';
}

var image4 = document.getElementById('image4');
if (this.parameters.image4) {
  image4.style.left = xPos4 + 'px';
  image4.style.top = yPos4 + 'px';
  image4.style.visibility = 'visible';
} else {
  image4.style.visibility = 'hidden';
}

var image5 = document.getElementById('image5');
if (this.parameters.image5) {
  image5.style.left = xPos5 + 'px';
  image5.style.top = yPos5 + 'px';
  image5.style.visibility = 'visible';
} else {
  image5.style.visibility = 'hidden';
}

}
                      },
                      "title": "Encoding_Screen",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n\r\n  \u003Cdiv class = \"pickparent\" style= \"\"\u003E\r\n     \u003Csvg class=\"pickpicker\"\r\n          height =\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" \r\n          viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\r\n          \u003C!–– keep scaling similar for object with: preserveAspectRatio =\"xMinYMin meet\", put it back bfore viewbox if needed --\u003E\r\n       \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\r\n          style=\"fill: #f2f2f2\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \r\n          style=\"fill: white\"\r\n        \u002F\u003E\r\n      \u003C\u002Fsvg\u003E\r\n\r\n      \u003Cimg id=\"image1\" class='pickimage' src=\"static\u002F${this.parameters.image1}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue1}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image2\" class='pickimage' src=\"static\u002F${this.parameters.image2}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue2}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image3\" class='pickimage' src=\"static\u002F${this.parameters.image3}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue3}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image4\" class='pickimage' src=\"static\u002F${this.parameters.image4}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue4}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image5\" class='pickimage' src=\"static\u002F${this.parameters.image5}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue5}deg)'\u003E\r\n\r\n  \u003C\u002Fdiv\u003E\r\n\r\n\u003C\u002Fmain\u003E\r\n\r\n  \u003Cfooter\u003E\r\n  \u003Cp id=\"fwd\"\u003E\r\n \r\n  \u003C\u002Fp\u003E\r\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\r\n    I'm just here for similar footer\r\n\u003Cbr\u003E\r\n\u003Cbr\u003E\r\n\u003Cbr\u003E\r\n  \u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E\r\n\r\n\r\n\r\n\r\n",
                      "tardy": true,
                      "timeout": "3000"
                    },
                    {
                      "type": "lab.html.Screen",
                      "files": {},
                      "responses": {},
                      "parameters": {},
                      "messageHandlers": {},
                      "title": "Retention_interval",
                      "timeout": "1000"
                    }
                  ]
                }
              },
              {
                "type": "lab.flow.Loop",
                "templateParameters": [
                  {
                    "trial_n": "16",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_110.png",
                    "hue": "241",
                    "theta": "96"
                  },
                  {
                    "trial_n": "16",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_111.png",
                    "hue": "304",
                    "theta": "189"
                  },
                  {
                    "trial_n": "16",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_112.png",
                    "hue": "90",
                    "theta": "309"
                  },
                  {
                    "trial_n": "17",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_113.png",
                    "hue": "107",
                    "theta": "14"
                  },
                  {
                    "trial_n": "17",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_114.png",
                    "hue": "279",
                    "theta": "120"
                  },
                  {
                    "trial_n": "17",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_115.png",
                    "hue": "34",
                    "theta": "241"
                  },
                  {
                    "trial_n": "18",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_116.png",
                    "hue": "258",
                    "theta": "74"
                  },
                  {
                    "trial_n": "18",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_117.png",
                    "hue": "19",
                    "theta": "162"
                  },
                  {
                    "trial_n": "18",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_118.png",
                    "hue": "171",
                    "theta": "328"
                  },
                  {
                    "trial_n": "19",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_119.png",
                    "hue": "226",
                    "theta": "66"
                  },
                  {
                    "trial_n": "19",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_120.png",
                    "hue": "325",
                    "theta": "129"
                  },
                  {
                    "trial_n": "19",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_121.png",
                    "hue": "78",
                    "theta": "303"
                  },
                  {
                    "trial_n": "20",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_122.png",
                    "hue": "74",
                    "theta": "127"
                  },
                  {
                    "trial_n": "20",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_123.png",
                    "hue": "182",
                    "theta": "191"
                  },
                  {
                    "trial_n": "20",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_124.png",
                    "hue": "311",
                    "theta": "268"
                  },
                  {
                    "trial_n": "21",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_125.png",
                    "hue": "158",
                    "theta": "28"
                  },
                  {
                    "trial_n": "21",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_126.png",
                    "hue": "220",
                    "theta": "211"
                  },
                  {
                    "trial_n": "21",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_127.png",
                    "hue": "66",
                    "theta": "274"
                  },
                  {
                    "trial_n": "22",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_128.png",
                    "hue": "152",
                    "theta": "70"
                  },
                  {
                    "trial_n": "22",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_129.png",
                    "hue": "337",
                    "theta": "180"
                  },
                  {
                    "trial_n": "22",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_130.png",
                    "hue": "10",
                    "theta": "325"
                  },
                  {
                    "trial_n": "23",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_131.png",
                    "hue": "212",
                    "theta": "40"
                  },
                  {
                    "trial_n": "23",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_132.png",
                    "hue": "278",
                    "theta": "179"
                  },
                  {
                    "trial_n": "23",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_133.png",
                    "hue": "81",
                    "theta": "285"
                  },
                  {
                    "trial_n": "24",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_134.png",
                    "hue": "271",
                    "theta": "83"
                  },
                  {
                    "trial_n": "24",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_135.png",
                    "hue": "30",
                    "theta": "171"
                  },
                  {
                    "trial_n": "24",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_136.png",
                    "hue": "195",
                    "theta": "348"
                  },
                  {
                    "trial_n": "25",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_137.png",
                    "hue": "133",
                    "theta": "54"
                  },
                  {
                    "trial_n": "25",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_138.png",
                    "hue": "55",
                    "theta": "216"
                  },
                  {
                    "trial_n": "25",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_139.png",
                    "hue": "199",
                    "theta": "336"
                  },
                  {
                    "trial_n": "26",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_140.png",
                    "hue": "266",
                    "theta": "60"
                  },
                  {
                    "trial_n": "26",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_141.png",
                    "hue": "121",
                    "theta": "225"
                  },
                  {
                    "trial_n": "26",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_142.png",
                    "hue": "15",
                    "theta": "355"
                  },
                  {
                    "trial_n": "27",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_143.png",
                    "hue": "336",
                    "theta": "88"
                  },
                  {
                    "trial_n": "27",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_144.png",
                    "hue": "174",
                    "theta": "167"
                  },
                  {
                    "trial_n": "27",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_145.png",
                    "hue": "248",
                    "theta": "344"
                  },
                  {
                    "trial_n": "28",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_146.png",
                    "hue": "286",
                    "theta": "110"
                  },
                  {
                    "trial_n": "28",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_147.png",
                    "hue": "164",
                    "theta": "204"
                  },
                  {
                    "trial_n": "28",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_148.png",
                    "hue": "52",
                    "theta": "341"
                  },
                  {
                    "trial_n": "29",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_149.png",
                    "hue": "110",
                    "theta": "10"
                  },
                  {
                    "trial_n": "29",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_150.png",
                    "hue": "29",
                    "theta": "136"
                  },
                  {
                    "trial_n": "29",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_151.png",
                    "hue": "250",
                    "theta": "298"
                  },
                  {
                    "trial_n": "30",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_152.png",
                    "hue": "141",
                    "theta": "111"
                  },
                  {
                    "trial_n": "30",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_153.png",
                    "hue": "97",
                    "theta": "230"
                  },
                  {
                    "trial_n": "30",
                    "block_n": "2",
                    "load_n": "3",
                    "image": "image_154.png",
                    "hue": "11",
                    "theta": "353"
                  }
                ],
                "sample": {
                  "mode": "sequential",
                  "n": "3"
                },
                "files": {},
                "responses": {},
                "parameters": {},
                "messageHandlers": {
                  "before:prepare": function anonymous(
) {
this.parameters.practice = "no"

this.options.templateParameters = this.options.templateParameters.filter(row => row.trial_n == this.parameters.trial)
}
                },
                "title": "Recall_Loop_load_3",
                "shuffleGroups": [],
                "template": {
                  "type": "lab.flow.Sequence",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Recall_Sequence_load_3",
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
// prepare modulus function
Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
}

// no picking when mouse is not active
let isPicking = false

// introduce global variable for button visibility state
let isButtonVisible = false

// function to get position during mousedown. set picking to active
this.options.events['mousedown'] = function (e) {
  isPicking = true // need to get position already here
  offsetX = document.getElementById('previewL').offsetLeft - e.clientX
  offsetY = document.getElementById('previewL').offsetTop - e.clientY
}

// when mouse is released, picking is not active again
this.options.events['mouseup'] = function () {
  isPicking = false
}

// what happens when mouse is moving over the grey circle area
this.options.events['mousemove #locationCircle'] = function (event) {
  if (isPicking) {

    // set position of image to where the mouse is. it is for upper left corner of the image.
    document.getElementById('previewL').style.left = (event.clientX + offsetX) + "px"
    document.getElementById('previewL').style.top = (event.clientY + offsetY) + "px"

    // we need to take the relation to circle and take the center of object (now we subtract)
    this.parameters.imgPosXTest = (event.clientX + offsetX) - this.state.imgShift
    this.parameters.imgPosYTest = (event.clientY + offsetY) - this.state.imgShift

    // use pythagoras theorem to check for image movement on circle
    let imageRadius = Math.sqrt(Math.pow(this.parameters.imgPosXTest, 2) + Math.pow(this.parameters.imgPosYTest, 2));

    // set parameter for button visibility
    if (imageRadius > 120) {
      if (!isButtonVisible) {
        // I want the continue button to show.
        setVisibility('#cmt', true)
      }
    } else {
      if (isButtonVisible) {
        // I dont want the continue button to show.
        setVisibility('#cmt', false)
      }
    }

    // calculate angle in radians
    const locAngleRadians = Math.atan2(this.parameters.imgPosYTest, this.parameters.imgPosXTest)

    // transform from radians to degrees
    const locAngleDegrees = locAngleRadians * 180 / Math.PI

    // save location adjustments etc NOTE: IF YOU HAVE TWO COMPONENTS FOR LOCATION AND COLOUR, YOU COULD HAVE THE SAME VARIABLE NAMES. THEN IT WOULD BE SAVED IN THE SAME COLUMN BUT YOU CAN FILTER AFTER THE NAME OF THE COMPONENT LATER. YOU CAN ALSO FILTER FOR COMPONENT WHEN READING IT OUT OF THE DATASTORE FOR FEEDBACK LATER. 
    this.data.location_angle_study = this.parameters.theta
    this.data.location_angle_test = locAngleDegrees
    this.data.location_angle_deviation = (((this.data.location_angle_study - this.data.location_angle_test) + 180).mod(360)) - 180
    this.data.location_angle_abs_deviation = Math.abs(this.data.location_angle_deviation)
  }
}

// show forward button only when location adjustment has been made
const setVisibility = (selector, isVisible) => {
  // extract the content from the current element
  const target = this.options.el.querySelector(selector)
  target.style.visibility = isVisible ? 'visible' : 'hidden'
  isButtonVisible = isVisible ? true : false
}



},
                        "run": function anonymous(
) {
// present object in center at the beginning
document.getElementById('previewL').style.top  =  0 + this.state.imgShift  + "px"
document.getElementById('previewL').style.left =  0 + this.state.imgShift  + "px"

  

}
                      },
                      "title": "Location_Recall_STM3",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\n\n    \u003Cdiv class = \"pickparent\" style= \"\"\u003E\n         \u003Csvg class='pickpicker' height=\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\n        \n          \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\n          style=\"fill: #f2f2f2\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \n          style=\"fill: white\"\n        \u002F\u003E\n      \u003C\u002Fsvg\u003E\n    \n     \u003Cimg class='pickimage'id=\"previewL\" src=\"static\u002F${this.parameters.image}\"      \n       style = 'height: ${this.state.imgHeight + \"px\"}; pointer-events: none;'\u003E\n\n\n    \u003C\u002Fdiv\u003E\n\n\u003C\u002Fmain\u003E\n\n\u003Cfooter\u003E\n  \u003Cp id=\"fwd\"\u003E\n  Keep left mouse button pressed and move object to set LOCATION on circle.\n  \u003C\u002Fp\u003E\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\n    Confirm selected LOCATION and continue\n  \u003C\u002Fbutton\u003E\n\u003C\u002Ffooter\u003E",
                      "tardy": true,
                      "skip": "${this.state.counterbalancing != 1}"
                    },
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
Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
}

let isPicking = false

// set dummy to hide / present button
let dummy_button = 999

this.options.events['mousedown'] = function() {
  isPicking = true
}

this.options.events['mouseup'] = function() {
  isPicking = false
}

// create random offset between -180 and +180
offset = Math.random() * 360 -180

this.options.events['mousemove #colorCircle'] = function(event) {
  if (isPicking) {
    // extract click coordinates from event,
    // and make them relative to the circle center by subtracting radius-imgHeight
    this.parameters.colX = event.offsetX - this.state.imgShift 
    this.parameters.colY = event.offsetY - this.state.imgShift 

    // compute angle
    const angleRadians = Math.atan2(this.parameters.colY, this.parameters.colX)

    // transform from radians to degrees
    const angleDegrees = angleRadians * 180 / Math.PI

    // randomly shift location of colors on color circle
    const colorAngle = (((angleDegrees + offset) + 180).mod(360)) - 180

    // apply color to preview image using hue-rotate
    const preview = this.options.el.querySelector('#preview')
    preview.style.filter = `hue-rotate(${ colorAngle }deg)`
    
    // note that mouse was moved to show button
    dummy_button = 1
    
    // save color adjustments etc. IF YOU HAVE TWO COMPONENTS FOR LOCATION AND COLOUR, YOU COULD HAVE THE SAME VARIABLE NAMES. THEN IT WOULD BE SAVED IN THE SAME COLUMN BUT YOU CAN FILTER AFTER THE NAME OF THE COMPONENT LATER. YOU CAN ALSO FILTER FOR COMPONENT WHEN READING IT OUT OF THE DATASTORE FOR FEEDBACK LATER. 
    this.data.color_offset = offset
    this.data.color_angle_study = this.parameters.hue
    this.data.color_angle_test = colorAngle
    this.data.color_angle_deviation = (((this.data.color_angle_study - this.data.color_angle_test) + 180).mod(360)) - 180
    this.data.color_angle_abs_deviation = Math.abs(this.data.color_angle_deviation)

  }

}

// show forward button only when color adjustment has been made

const setVisibility = (selector, isVisible) => {
  // Extract the content from the current element
  const target = this.options.el.querySelector(selector)
  target.style.visibility = isVisible ? 'visible' : 'hidden'
}

this.options.events['mousemove'] = function(){ 
// make sure a color has been selected
if(dummy_button != 999) {
  setVisibility('#cmt', true) // make sure that button is visible
  }
}
},
                        "run": function anonymous(
) {
// present image in center 
document.getElementById('preview').style.top  =  0 + this.state.imgShift + "px"
document.getElementById('preview').style.left =  0 + this.state.imgShift + "px"

}
                      },
                      "title": "Colour_Recall_STM3",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n\r\n    \u003Cdiv class='pickparent' style=''\u003E\r\n      \u003Csvg class='pickpicker' height=\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\r\n        \r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\r\n          style=\"fill: #f2f2f2\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \r\n          style=\"fill: white\"\r\n        \u002F\u003E\r\n      \u003C\u002Fsvg\u003E\r\n      \u003Cimg class='pickimage' id=\"preview\" src='static\u002F${this.parameters.image}' style = 'height: ${this.state.imgHeight + \"px\"}; pointer-events: none;'\u003E  \r\n    \u003C\u002Fdiv\u003E\r\n\r\n\u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n  \u003Cp id=\"fwd\"\u003E\r\n  Keep left mouse button pressed and move mouse over circle to set COLOUR.\r\n  \u003C\u002Fp\u003E\r\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\r\n    Confirm selected COLOUR and continue\r\n  \u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E",
                      "tardy": true
                    },
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
// prepare modulus function
Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
}

// no picking when mouse is not active
let isPicking = false

// introduce global variable for button visibility state
let isButtonVisible = false

// function to get position during mousedown. set picking to active
this.options.events['mousedown'] = function (e) {
  isPicking = true // need to get position already here
  offsetX = document.getElementById('previewL').offsetLeft - e.clientX
  offsetY = document.getElementById('previewL').offsetTop - e.clientY
}

// when mouse is released, picking is not active again
this.options.events['mouseup'] = function () {
  isPicking = false
}

// what happens when mouse is moving over the grey circle area
this.options.events['mousemove #locationCircle'] = function (event) {
  if (isPicking) {

    // set position of image to where the mouse is. it is for upper left corner of the image.
    document.getElementById('previewL').style.left = (event.clientX + offsetX) + "px"
    document.getElementById('previewL').style.top = (event.clientY + offsetY) + "px"

    // we need to take the relation to circle and take the center of object (now we subtract)
    this.parameters.imgPosXTest = (event.clientX + offsetX) - this.state.imgShift
    this.parameters.imgPosYTest = (event.clientY + offsetY) - this.state.imgShift

    // use pythagoras theorem to check for image movement on circle
    let imageRadius = Math.sqrt(Math.pow(this.parameters.imgPosXTest, 2) + Math.pow(this.parameters.imgPosYTest, 2));

    // set parameter for button visibility
    if (imageRadius > 120) {
      if (!isButtonVisible) {
        // I want the continue button to show.
        setVisibility('#cmt', true)
      }
    } else {
      if (isButtonVisible) {
        // I dont want the continue button to show.
        setVisibility('#cmt', false)
      }
    }

    // calculate angle in radians
    const locAngleRadians = Math.atan2(this.parameters.imgPosYTest, this.parameters.imgPosXTest)

    // transform from radians to degrees
    const locAngleDegrees = locAngleRadians * 180 / Math.PI

    // save location adjustments etc NOTE: IF YOU HAVE TWO COMPONENTS FOR LOCATION AND COLOUR, YOU COULD HAVE THE SAME VARIABLE NAMES. THEN IT WOULD BE SAVED IN THE SAME COLUMN BUT YOU CAN FILTER AFTER THE NAME OF THE COMPONENT LATER. YOU CAN ALSO FILTER FOR COMPONENT WHEN READING IT OUT OF THE DATASTORE FOR FEEDBACK LATER. 
    this.data.location_angle_study = this.parameters.theta
    this.data.location_angle_test = locAngleDegrees
    this.data.location_angle_deviation = (((this.data.location_angle_study - this.data.location_angle_test) + 180).mod(360)) - 180
    this.data.location_angle_abs_deviation = Math.abs(this.data.location_angle_deviation)
  }
}

// show forward button only when location adjustment has been made
const setVisibility = (selector, isVisible) => {
  // extract the content from the current element
  const target = this.options.el.querySelector(selector)
  target.style.visibility = isVisible ? 'visible' : 'hidden'
  isButtonVisible = isVisible ? true : false
}



},
                        "run": function anonymous(
) {
// present object in center at the beginning
document.getElementById('previewL').style.top  =  0 + this.state.imgShift  + "px"
document.getElementById('previewL').style.left =  0 + this.state.imgShift  + "px"

  

}
                      },
                      "title": "Location_Recall_STM3",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\n\n    \u003Cdiv class = \"pickparent\" style= \"\"\u003E\n         \u003Csvg class='pickpicker' height=\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\n        \n          \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\n          style=\"fill: #f2f2f2\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \n          style=\"fill: white\"\n        \u002F\u003E\n      \u003C\u002Fsvg\u003E\n    \n     \u003Cimg class='pickimage'id=\"previewL\" src=\"static\u002F${this.parameters.image}\"      \n       style = 'height: ${this.state.imgHeight + \"px\"}; pointer-events: none;'\u003E\n\n\n    \u003C\u002Fdiv\u003E\n\n\u003C\u002Fmain\u003E\n\n\u003Cfooter\u003E\n  \u003Cp id=\"fwd\"\u003E\n  Keep left mouse button pressed and move object to set LOCATION on circle.\n  \u003C\u002Fp\u003E\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\n    Confirm selected LOCATION and continue\n  \u003C\u002Fbutton\u003E\n\u003C\u002Ffooter\u003E",
                      "tardy": true,
                      "skip": "${this.state.counterbalancing != 2}"
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          "type": "lab.html.Screen",
          "files": {},
          "responses": {
            "click button": "Next"
          },
          "parameters": {},
          "messageHandlers": {
            "run": function anonymous(
) {
// Get the circle indicator elements
const locationIndicator = document.getElementById('locationIndicator');
const colorIndicator = document.getElementById('colorIndicator');

// filter by Location_Recall
const location_filtered_data = this.options.datastore.data.filter(
  row => row.sender === 'Location_Recall_STM3' && row.ended_on !== 'skipped' && row.block === this.parameters.block
);

// filter by Colour_Recall
const color_filtered_data = this.options.datastore.data.filter(
  row => row.sender === 'Colour_Recall_STM3' && row.ended_on !== 'skipped' && row.block === this.parameters.block
);

// Calculate average deviation for Location_Recall
const locationTotalRows = location_filtered_data.length;
const locationDeviationSum = location_filtered_data.reduce((sum, row) => sum + Math.abs(row.location_angle_abs_deviation), 0);
const locationAverageDeviation = locationTotalRows === 0 ? 0 : locationDeviationSum / locationTotalRows;

// Calculate average deviation for Colour_Recall
const colorTotalRows = color_filtered_data.length;
const colorDeviationSum = color_filtered_data.reduce((sum, row) => sum + Math.abs(row.color_angle_abs_deviation), 0);
const colorAverageDeviation = colorTotalRows === 0 ? 0 : colorDeviationSum / colorTotalRows;

// Take the square root of the average deviations
const sqrtLocationAverageDeviation = Math.sqrt(locationAverageDeviation);
const sqrtColorAverageDeviation = Math.sqrt(colorAverageDeviation);

// Calculate the position of the circle indicators
const locationIndicatorPosition = (sqrtLocationAverageDeviation / Math.sqrt(180)) * 100;
const colorIndicatorPosition = (sqrtColorAverageDeviation / Math.sqrt(180)) * 100;

// Set the position of the circle indicators
locationIndicator.style.left = `${locationIndicatorPosition}%`;
colorIndicator.style.left = `${colorIndicatorPosition}%`;

skillsContainer1.style.transform = "scale("+window.scaling_rectx*0.004+")";
skillsContainer2.style.transform = "scale("+window.scaling_rectx*0.004+")";



}
          },
          "title": "Block_Feedback_Screen",
          "content": " \u003Cdiv class=\"centered-container\"\u003E\r\n \u003Cdiv class=\"block-feedback\"\u003E\r\n    \u003Ch1 style=\"text-align: center; font-size: 28px;\"\u003EFeedback\u003C\u002Fh1\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\r\n  \u003Cdiv class=\"skills-container\" id=\"skillsContainer1\"\u003E\r\n    \u003Cp style = \"font-size: 28px\" id=\"fontLocation\"\u003ELocation:\u003C\u002Fp\u003E\r\n    \u003Cdiv class=\"skills-bar\"\u003E\r\n      \u003Cdiv class=\"skills-range\"\u003E\u003C\u002Fdiv\u003E\r\n      \u003Cdiv class=\"indicator-circle\" id=\"locationIndicator\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n    \u003Cp class=\"skills-label\" style=\"font-size:50px; color: green; font-weight: bold;\"\u003E&#x2713\u003C\u002Fp\u003E\r\n    \u003Cp class=\"skills-max-label\" style=\"font-size:50px; color: red; font-weight: bold;\"\u003E&#x2717\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\r\n  \u003Cdiv class=\"skills-container\" id=\"skillsContainer2\"\u003E\r\n    \u003Cp style = \"font-size: 28px\"\u003EColour:\u003C\u002Fp\u003E\r\n    \u003Cdiv class=\"skills-bar\"\u003E\r\n      \u003Cdiv class=\"skills-range\"\u003E\u003C\u002Fdiv\u003E\r\n      \u003Cdiv class=\"indicator-circle\" id=\"colorIndicator\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n    \u003Cp class=\"skills-label\" style=\"font-size:50px; color: green; font-weight: bold;\"\u003E&#x2713\u003C\u002Fp\u003E\r\n    \u003Cp class=\"skills-max-label\" style=\"font-size:50px; color: red; font-weight: bold;\"\u003E&#x2717\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n\u003Cfooter style=\"position: absolute; width: calc(100% - 2.4%); bottom: 1.2%; left: 1.2%; right: 1.2%; text-align: center;\"\u003E\r\n    \u003Cbutton id=\"buttonSubmit\"\u003ENext→\u003C\u002Fbutton\u003E\r\n  \u003C\u002Ffooter\u003E\r\n\r\n\r\n\r\n",
          "tardy": true
        },
        {
          "type": "lab.html.Page",
          "items": [
            {
              "type": "text",
              "title": "\u003Cheader\u003E \u003Ch1\u003EBreak \u003C\u002Fheader\u003E \u003C\u002Fh1\u003E",
              "content": "\u003Cdiv class= \"message\"\u003E\n\u003Cdiv\u003E\n  \u003Cspan id=\"endMessage_load3\" \u003E\u003C\u002Fspan\u003E\n\u003C\u002Fdiv\u003E\n"
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
    document.getElementById('endMessage_load3').innerHTML = "<p> Great! Take a short break before we try that again with  <b> five </b> objects on screen at a time. </p> <p> Click 'Next' when you are ready to move on. </p>";
}
          },
          "title": "Block_Break_Screen",
          "tardy": true
        },
        {
          "type": "lab.flow.Loop",
          "templateParameters": [
            {
              "trial": "31"
            },
            {
              "trial": "32"
            },
            {
              "trial": "33"
            },
            {
              "trial": "34"
            },
            {
              "trial": "35"
            },
            {
              "trial": "36"
            },
            {
              "trial": "37"
            },
            {
              "trial": "38"
            }
          ],
          "sample": {
            "mode": "draw",
            "n": ""
          },
          "files": {},
          "responses": {},
          "parameters": {},
          "messageHandlers": {},
          "title": "Load_5",
          "shuffleGroups": [],
          "template": {
            "type": "lab.flow.Sequence",
            "files": {},
            "responses": {},
            "parameters": {},
            "messageHandlers": {
              "before:prepare": function anonymous(
) {
//prepare parameters that can be used later (therefore in state, not parameters) 

// prepare presentation of wheel (for location and color)
// radius for circles
this.state.radius  = window.scaling_rectx 
this.state.radius1 =  this.state.radius - 1 
this.state.radius2 =  this.state.radius - 20
this.state.radius3 =  this.state.radius - 21 // if you make this subtracted number larger, the grey area should increase

this.state.diameter = this.state.radius * 2

// prepare image size
this.state.imgHeight = window.scaling_rectx * 0.6 // we present image squared, so this is enough
// this.state.imgWidth = 180

// shift the image position by this value (so it is relative to the center of the circles)
this.state.imgShift = this.state.radius - this.state.imgHeight/2


}
            },
            "title": "Sequence",
            "content": [
              {
                "type": "lab.flow.Loop",
                "templateParameters": [
                  {
                    "trial_n": "31",
                    "block_n": "3",
                    "load_n": "5",
                    "image1": "image_159.png",
                    "hue1": "315",
                    "theta1": "226",
                    "image2": "image_158.png",
                    "hue2": "262",
                    "theta2": "42",
                    "image3": "image_157.png",
                    "hue3": "208",
                    "theta3": "291",
                    "image4": "image_155.png",
                    "hue4": "10",
                    "theta4": "93",
                    "image5": "image_156.png",
                    "hue5": "136",
                    "theta5": "161"
                  },
                  {
                    "trial_n": "32",
                    "block_n": "3",
                    "load_n": "5",
                    "image1": "image_161.png",
                    "hue1": "78",
                    "theta1": "199",
                    "image2": "image_164.png",
                    "hue2": "283",
                    "theta2": "129",
                    "image3": "image_160.png",
                    "hue3": "13",
                    "theta3": "269",
                    "image4": "image_162.png",
                    "hue4": "130",
                    "theta4": "75",
                    "image5": "image_163.png",
                    "hue5": "213",
                    "theta5": "335"
                  },
                  {
                    "trial_n": "33",
                    "block_n": "3",
                    "load_n": "5",
                    "image1": "image_169.png",
                    "hue1": "338",
                    "theta1": "128",
                    "image2": "image_165.png",
                    "hue2": "46",
                    "theta2": "260",
                    "image3": "image_168.png",
                    "hue3": "254",
                    "theta3": "205",
                    "image4": "image_167.png",
                    "hue4": "194",
                    "theta4": "335",
                    "image5": "image_166.png",
                    "hue5": "97",
                    "theta5": "56"
                  },
                  {
                    "trial_n": "34",
                    "block_n": "3",
                    "load_n": "5",
                    "image1": "image_171.png",
                    "hue1": "109",
                    "theta1": "349",
                    "image2": "image_172.png",
                    "hue2": "171",
                    "theta2": "283",
                    "image3": "image_173.png",
                    "hue3": "224",
                    "theta3": "169",
                    "image4": "image_170.png",
                    "hue4": "21",
                    "theta4": "62",
                    "image5": "image_174.png",
                    "hue5": "296",
                    "theta5": "226"
                  },
                  {
                    "trial_n": "35",
                    "block_n": "3",
                    "load_n": "5",
                    "image1": "image_178.png",
                    "hue1": "303",
                    "theta1": "165",
                    "image2": "image_176.png",
                    "hue2": "128",
                    "theta2": "223",
                    "image3": "image_179.png",
                    "hue3": "356",
                    "theta3": "68",
                    "image4": "image_175.png",
                    "hue4": "53",
                    "theta4": "348",
                    "image5": "image_177.png",
                    "hue5": "182",
                    "theta5": "276"
                  },
                  {
                    "trial_n": "36",
                    "block_n": "3",
                    "load_n": "5",
                    "image1": "image_181.png",
                    "hue1": "120",
                    "theta1": "142",
                    "image2": "image_180.png",
                    "hue2": "58",
                    "theta2": "9",
                    "image3": "image_184.png",
                    "hue3": "348",
                    "theta3": "89",
                    "image4": "image_183.png",
                    "hue4": "250",
                    "theta4": "302",
                    "image5": "image_182.png",
                    "hue5": "178",
                    "theta5": "240"
                  },
                  {
                    "trial_n": "37",
                    "block_n": "3",
                    "load_n": "5",
                    "image1": "image_189.png",
                    "hue1": "323",
                    "theta1": "348",
                    "image2": "image_187.png",
                    "hue2": "166",
                    "theta2": "47",
                    "image3": "image_186.png",
                    "hue3": "97",
                    "theta3": "177",
                    "image4": "image_185.png",
                    "hue4": "21",
                    "theta4": "100",
                    "image5": "image_188.png",
                    "hue5": "270",
                    "theta5": "263"
                  },
                  {
                    "trial_n": "38",
                    "block_n": "3",
                    "load_n": "5",
                    "image1": "image_194.png",
                    "hue1": "326",
                    "theta1": "46",
                    "image2": "image_193.png",
                    "hue2": "247",
                    "theta2": "350",
                    "image3": "image_191.png",
                    "hue3": "83",
                    "theta3": "119",
                    "image4": "image_192.png",
                    "hue4": "145",
                    "theta4": "260",
                    "image5": "image_190.png",
                    "hue5": "23",
                    "theta5": "186"
                  }
                ],
                "sample": {
                  "mode": "sequential",
                  "n": ""
                },
                "files": {},
                "responses": {},
                "parameters": {},
                "messageHandlers": {
                  "before:prepare": function anonymous(
) {
this.options.templateParameters = this.options.templateParameters.filter(row => row.trial_n == this.parameters.trial)
}
                },
                "title": "Encoding_Loop_load_5",
                "indexParameter": "counter",
                "shuffleGroups": [],
                "template": {
                  "type": "lab.flow.Sequence",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Encoding_Sequence",
                  "content": [
                    {
                      "type": "lab.html.Screen",
                      "files": {},
                      "responses": {},
                      "parameters": {},
                      "messageHandlers": {
                        "run": function anonymous(
) {
this.state.imgHeight

// transform the deg to radians (because of Math.cos and Math.sin)
var theta1 = this.parameters.theta1 * Math.PI/180;
var theta2 = this.parameters.theta2 * Math.PI/180;
var theta3 = this.parameters.theta3 * Math.PI/180;
var theta4 = this.parameters.theta4 * Math.PI/180;
var theta5 = this.parameters.theta5 * Math.PI/180;

// calculate x and y coordinates. coordinates are shifted in relation to center of the viewbox / circle and corresponding to center of the image
var xPos = (this.state.radius * Math.cos(theta1)) + this.state.imgShift;
var yPos = (this.state.radius * Math.sin(theta1)) + this.state.imgShift;

var xPos2 = (this.state.radius * Math.cos(theta2)) + this.state.imgShift;
var yPos2 = (this.state.radius * Math.sin(theta2)) + this.state.imgShift;

var xPos3 = (this.state.radius * Math.cos(theta3)) + this.state.imgShift;
var yPos3 = (this.state.radius * Math.sin(theta3)) + this.state.imgShift;

var xPos4 = (this.state.radius * Math.cos(theta4)) + this.state.imgShift;
var yPos4 = (this.state.radius * Math.sin(theta4)) + this.state.imgShift;

var xPos5 = (this.state.radius * Math.cos(theta5)) + this.state.imgShift;
var yPos5 = (this.state.radius * Math.sin(theta5)) + this.state.imgShift;

// save coordinates
this.options.datastore.set('imgPosX', xPos);
this.options.datastore.set('imgPosY', yPos);

this.options.datastore.set('imgPosX', xPos2);
this.options.datastore.set('imgPosY', yPos2);

this.options.datastore.set('imgPosX', xPos3);
this.options.datastore.set('imgPosY', yPos3);

this.options.datastore.set('imgPosX', xPos4);
this.options.datastore.set('imgPosY', yPos4);

this.options.datastore.set('imgPosX', xPos5);
this.options.datastore.set('imgPosY', yPos5);

// set image positions and visibility
var image1 = document.getElementById('image1');
if (this.parameters.image1) {
  image1.style.left = xPos + 'px';
  image1.style.top = yPos + 'px';
  image1.style.visibility = 'visible';
} else {
  image1.style.visibility = 'hidden';
}

var image2 = document.getElementById('image2');
if (this.parameters.image2) {
  image2.style.left = xPos2 + 'px';
  image2.style.top = yPos2 + 'px';
  image2.style.visibility = 'visible';
} else {
  image2.style.visibility = 'hidden';
}

var image3 = document.getElementById('image3');
if (this.parameters.image3) {
  image3.style.left = xPos3 + 'px';
  image3.style.top = yPos3 + 'px';
  image3.style.visibility = 'visible';
} else {
  image3.style.visibility = 'hidden';
}

var image4 = document.getElementById('image4');
if (this.parameters.image4) {
  image4.style.left = xPos4 + 'px';
  image4.style.top = yPos4 + 'px';
  image4.style.visibility = 'visible';
} else {
  image4.style.visibility = 'hidden';
}

var image5 = document.getElementById('image5');
if (this.parameters.image5) {
  image5.style.left = xPos5 + 'px';
  image5.style.top = yPos5 + 'px';
  image5.style.visibility = 'visible';
} else {
  image5.style.visibility = 'hidden';
}

}
                      },
                      "title": "Encoding_Screen",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n\r\n  \u003Cdiv class = \"pickparent\" style= \"\"\u003E\r\n     \u003Csvg class=\"pickpicker\"\r\n          height =\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" \r\n          viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\r\n          \u003C!–– keep scaling similar for object with: preserveAspectRatio =\"xMinYMin meet\", put it back bfore viewbox if needed --\u003E\r\n       \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\r\n          style=\"fill: #f2f2f2\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \r\n          style=\"fill: white\"\r\n        \u002F\u003E\r\n      \u003C\u002Fsvg\u003E\r\n\r\n      \u003Cimg id=\"image1\" class='pickimage' src=\"static\u002F${this.parameters.image1}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue1}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image2\" class='pickimage' src=\"static\u002F${this.parameters.image2}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue2}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image3\" class='pickimage' src=\"static\u002F${this.parameters.image3}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue3}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image4\" class='pickimage' src=\"static\u002F${this.parameters.image4}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue4}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image5\" class='pickimage' src=\"static\u002F${this.parameters.image5}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue5}deg)'\u003E\r\n\r\n  \u003C\u002Fdiv\u003E\r\n\r\n\u003C\u002Fmain\u003E\r\n\r\n  \u003Cfooter\u003E\r\n  \u003Cp id=\"fwd\"\u003E\r\n \r\n  \u003C\u002Fp\u003E\r\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\r\n    I'm just here for similar footer\r\n\u003Cbr\u003E\r\n\u003Cbr\u003E\r\n\u003Cbr\u003E\r\n  \u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E\r\n\r\n\r\n",
                      "tardy": true,
                      "timeout": "3000"
                    },
                    {
                      "type": "lab.html.Screen",
                      "files": {},
                      "responses": {},
                      "parameters": {},
                      "messageHandlers": {},
                      "title": "Retention_interval",
                      "timeout": "1000"
                    }
                  ]
                }
              },
              {
                "type": "lab.flow.Loop",
                "templateParameters": [
                  {
                    "trial_n": "31",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_155.png",
                    "hue": "10",
                    "theta": "93"
                  },
                  {
                    "trial_n": "31",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_156.png",
                    "hue": "136",
                    "theta": "161"
                  },
                  {
                    "trial_n": "31",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_157.png",
                    "hue": "208",
                    "theta": "291"
                  },
                  {
                    "trial_n": "31",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_158.png",
                    "hue": "262",
                    "theta": "42"
                  },
                  {
                    "trial_n": "31",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_159.png",
                    "hue": "315",
                    "theta": "226"
                  },
                  {
                    "trial_n": "32",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_160.png",
                    "hue": "13",
                    "theta": "269"
                  },
                  {
                    "trial_n": "32",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_161.png",
                    "hue": "78",
                    "theta": "199"
                  },
                  {
                    "trial_n": "32",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_162.png",
                    "hue": "130",
                    "theta": "75"
                  },
                  {
                    "trial_n": "32",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_163.png",
                    "hue": "213",
                    "theta": "335"
                  },
                  {
                    "trial_n": "32",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_164.png",
                    "hue": "283",
                    "theta": "129"
                  },
                  {
                    "trial_n": "33",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_165.png",
                    "hue": "46",
                    "theta": "260"
                  },
                  {
                    "trial_n": "33",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_166.png",
                    "hue": "97",
                    "theta": "56"
                  },
                  {
                    "trial_n": "33",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_167.png",
                    "hue": "194",
                    "theta": "335"
                  },
                  {
                    "trial_n": "33",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_168.png",
                    "hue": "254",
                    "theta": "205"
                  },
                  {
                    "trial_n": "33",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_169.png",
                    "hue": "338",
                    "theta": "128"
                  },
                  {
                    "trial_n": "34",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_170.png",
                    "hue": "21",
                    "theta": "62"
                  },
                  {
                    "trial_n": "34",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_171.png",
                    "hue": "109",
                    "theta": "349"
                  },
                  {
                    "trial_n": "34",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_172.png",
                    "hue": "171",
                    "theta": "283"
                  },
                  {
                    "trial_n": "34",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_173.png",
                    "hue": "224",
                    "theta": "169"
                  },
                  {
                    "trial_n": "34",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_174.png",
                    "hue": "296",
                    "theta": "226"
                  },
                  {
                    "trial_n": "35",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_175.png",
                    "hue": "53",
                    "theta": "348"
                  },
                  {
                    "trial_n": "35",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_176.png",
                    "hue": "128",
                    "theta": "223"
                  },
                  {
                    "trial_n": "35",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_177.png",
                    "hue": "182",
                    "theta": "276"
                  },
                  {
                    "trial_n": "35",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_178.png",
                    "hue": "303",
                    "theta": "165"
                  },
                  {
                    "trial_n": "35",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_179.png",
                    "hue": "356",
                    "theta": "68"
                  },
                  {
                    "trial_n": "36",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_180.png",
                    "hue": "58",
                    "theta": "9"
                  },
                  {
                    "trial_n": "36",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_181.png",
                    "hue": "120",
                    "theta": "142"
                  },
                  {
                    "trial_n": "36",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_182.png",
                    "hue": "178",
                    "theta": "240"
                  },
                  {
                    "trial_n": "36",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_183.png",
                    "hue": "250",
                    "theta": "302"
                  },
                  {
                    "trial_n": "36",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_184.png",
                    "hue": "348",
                    "theta": "89"
                  },
                  {
                    "trial_n": "37",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_185.png",
                    "hue": "21",
                    "theta": "100"
                  },
                  {
                    "trial_n": "37",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_186.png",
                    "hue": "97",
                    "theta": "177"
                  },
                  {
                    "trial_n": "37",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_187.png",
                    "hue": "166",
                    "theta": "47"
                  },
                  {
                    "trial_n": "37",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_188.png",
                    "hue": "270",
                    "theta": "263"
                  },
                  {
                    "trial_n": "37",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_189.png",
                    "hue": "323",
                    "theta": "348"
                  },
                  {
                    "trial_n": "38",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_190.png",
                    "hue": "23",
                    "theta": "186"
                  },
                  {
                    "trial_n": "38",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_191.png",
                    "hue": "83",
                    "theta": "119"
                  },
                  {
                    "trial_n": "38",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_192.png",
                    "hue": "145",
                    "theta": "260"
                  },
                  {
                    "trial_n": "38",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_193.png",
                    "hue": "247",
                    "theta": "350"
                  },
                  {
                    "trial_n": "38",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_194.png",
                    "hue": "326",
                    "theta": "46"
                  }
                ],
                "sample": {
                  "mode": "sequential",
                  "n": "5"
                },
                "files": {},
                "responses": {},
                "parameters": {},
                "messageHandlers": {
                  "before:prepare": function anonymous(
) {
this.parameters.practice = "no"

this.options.templateParameters = this.options.templateParameters.filter(row => row.trial_n == this.parameters.trial)
}
                },
                "title": "Recall_Loop_load_5",
                "shuffleGroups": [],
                "template": {
                  "type": "lab.flow.Sequence",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Recall_Sequence_load_5",
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
// prepare modulus function
Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
}

// no picking when mouse is not active
let isPicking = false

// introduce global variable for button visibility state
let isButtonVisible = false

// function to get position during mousedown. set picking to active
this.options.events['mousedown'] = function (e) {
  isPicking = true // need to get position already here
  offsetX = document.getElementById('previewL').offsetLeft - e.clientX
  offsetY = document.getElementById('previewL').offsetTop - e.clientY
}

// when mouse is released, picking is not active again
this.options.events['mouseup'] = function () {
  isPicking = false
}

// what happens when mouse is moving over the grey circle area
this.options.events['mousemove #locationCircle'] = function (event) {
  if (isPicking) {

    // set position of image to where the mouse is. it is for upper left corner of the image.
    document.getElementById('previewL').style.left = (event.clientX + offsetX) + "px"
    document.getElementById('previewL').style.top = (event.clientY + offsetY) + "px"

    // we need to take the relation to circle and take the center of object (now we subtract)
    this.parameters.imgPosXTest = (event.clientX + offsetX) - this.state.imgShift
    this.parameters.imgPosYTest = (event.clientY + offsetY) - this.state.imgShift

    // use pythagoras theorem to check for image movement on circle
    let imageRadius = Math.sqrt(Math.pow(this.parameters.imgPosXTest, 2) + Math.pow(this.parameters.imgPosYTest, 2));

    // set parameter for button visibility
    if (imageRadius > 120) {
      if (!isButtonVisible) {
        // I want the continue button to show.
        setVisibility('#cmt', true)
      }
    } else {
      if (isButtonVisible) {
        // I dont want the continue button to show.
        setVisibility('#cmt', false)
      }
    }

    // calculate angle in radians
    const locAngleRadians = Math.atan2(this.parameters.imgPosYTest, this.parameters.imgPosXTest)

    // transform from radians to degrees
    const locAngleDegrees = locAngleRadians * 180 / Math.PI

    // save location adjustments etc NOTE: IF YOU HAVE TWO COMPONENTS FOR LOCATION AND COLOUR, YOU COULD HAVE THE SAME VARIABLE NAMES. THEN IT WOULD BE SAVED IN THE SAME COLUMN BUT YOU CAN FILTER AFTER THE NAME OF THE COMPONENT LATER. YOU CAN ALSO FILTER FOR COMPONENT WHEN READING IT OUT OF THE DATASTORE FOR FEEDBACK LATER. 
    this.data.location_angle_study = this.parameters.theta
    this.data.location_angle_test = locAngleDegrees
    this.data.location_angle_deviation = (((this.data.location_angle_study - this.data.location_angle_test) + 180).mod(360)) - 180
    this.data.location_angle_abs_deviation = Math.abs(this.data.location_angle_deviation)
  }
}

// show forward button only when location adjustment has been made
const setVisibility = (selector, isVisible) => {
  // extract the content from the current element
  const target = this.options.el.querySelector(selector)
  target.style.visibility = isVisible ? 'visible' : 'hidden'
  isButtonVisible = isVisible ? true : false
}



},
                        "run": function anonymous(
) {
// present object in center at the beginning
document.getElementById('previewL').style.top  =  0 + this.state.imgShift  + "px"
document.getElementById('previewL').style.left =  0 + this.state.imgShift  + "px"

  

}
                      },
                      "title": "Location_Recall_STM5",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\n\n    \u003Cdiv class = \"pickparent\" style= \"\"\u003E\n         \u003Csvg class='pickpicker' height=\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\n        \n          \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\n          style=\"fill: #f2f2f2\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \n          style=\"fill: white\"\n        \u002F\u003E\n      \u003C\u002Fsvg\u003E\n    \n     \u003Cimg class='pickimage'id=\"previewL\" src=\"static\u002F${this.parameters.image}\"      \n       style = 'height: ${this.state.imgHeight + \"px\"}; pointer-events: none;'\u003E\n\n\n    \u003C\u002Fdiv\u003E\n\n\u003C\u002Fmain\u003E\n\n\u003Cfooter\u003E\n  \u003Cp id=\"fwd\"\u003E\n  Keep left mouse button pressed and move object to set LOCATION on circle.\n  \u003C\u002Fp\u003E\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\n    Confirm selected LOCATION and continue\n  \u003C\u002Fbutton\u003E\n\u003C\u002Ffooter\u003E",
                      "tardy": true,
                      "skip": "${this.state.counterbalancing != 1}"
                    },
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
Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
}

let isPicking = false

// set dummy to hide / present button
let dummy_button = 999

this.options.events['mousedown'] = function() {
  isPicking = true
}

this.options.events['mouseup'] = function() {
  isPicking = false
}

// create random offset between -180 and +180
offset = Math.random() * 360 -180

this.options.events['mousemove #colorCircle'] = function(event) {
  if (isPicking) {
    // extract click coordinates from event,
    // and make them relative to the circle center by subtracting radius-imgHeight
    this.parameters.colX = event.offsetX - this.state.imgShift 
    this.parameters.colY = event.offsetY - this.state.imgShift 

    // compute angle
    const angleRadians = Math.atan2(this.parameters.colY, this.parameters.colX)

    // transform from radians to degrees
    const angleDegrees = angleRadians * 180 / Math.PI

    // randomly shift location of colors on color circle
    const colorAngle = (((angleDegrees + offset) + 180).mod(360)) - 180

    // apply color to preview image using hue-rotate
    const preview = this.options.el.querySelector('#preview')
    preview.style.filter = `hue-rotate(${ colorAngle }deg)`
    
    // note that mouse was moved to show button
    dummy_button = 1
    
    // save color adjustments etc. IF YOU HAVE TWO COMPONENTS FOR LOCATION AND COLOUR, YOU COULD HAVE THE SAME VARIABLE NAMES. THEN IT WOULD BE SAVED IN THE SAME COLUMN BUT YOU CAN FILTER AFTER THE NAME OF THE COMPONENT LATER. YOU CAN ALSO FILTER FOR COMPONENT WHEN READING IT OUT OF THE DATASTORE FOR FEEDBACK LATER. 
    this.data.color_offset = offset
    this.data.color_angle_study = this.parameters.hue
    this.data.color_angle_test = colorAngle
    this.data.color_angle_deviation = (((this.data.color_angle_study - this.data.color_angle_test) + 180).mod(360)) - 180
    this.data.color_angle_abs_deviation = Math.abs(this.data.color_angle_deviation)

  }

}

// show forward button only when color adjustment has been made

const setVisibility = (selector, isVisible) => {
  // Extract the content from the current element
  const target = this.options.el.querySelector(selector)
  target.style.visibility = isVisible ? 'visible' : 'hidden'
}

this.options.events['mousemove'] = function(){ 
// make sure a color has been selected
if(dummy_button != 999) {
  setVisibility('#cmt', true) // make sure that button is visible
  }
}
},
                        "run": function anonymous(
) {
// present image in center 
document.getElementById('preview').style.top  =  0 + this.state.imgShift + "px"
document.getElementById('preview').style.left =  0 + this.state.imgShift + "px"

}
                      },
                      "title": "Colour_Recall_STM5",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n\r\n    \u003Cdiv class='pickparent' style=''\u003E\r\n      \u003Csvg class='pickpicker' height=\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\r\n        \r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\r\n          style=\"fill: #f2f2f2\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \r\n          style=\"fill: white\"\r\n        \u002F\u003E\r\n      \u003C\u002Fsvg\u003E\r\n      \u003Cimg class='pickimage' id=\"preview\" src='static\u002F${this.parameters.image}' style = 'height: ${this.state.imgHeight + \"px\"}; pointer-events: none;'\u003E  \r\n    \u003C\u002Fdiv\u003E\r\n\r\n\u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n  \u003Cp id=\"fwd\"\u003E\r\n  Keep left mouse button pressed and move mouse over circle to set COLOUR.\r\n  \u003C\u002Fp\u003E\r\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\r\n    Confirm selected COLOUR and continue\r\n  \u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E",
                      "tardy": true
                    },
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
// prepare modulus function
Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
}

// no picking when mouse is not active
let isPicking = false

// introduce global variable for button visibility state
let isButtonVisible = false

// function to get position during mousedown. set picking to active
this.options.events['mousedown'] = function (e) {
  isPicking = true // need to get position already here
  offsetX = document.getElementById('previewL').offsetLeft - e.clientX
  offsetY = document.getElementById('previewL').offsetTop - e.clientY
}

// when mouse is released, picking is not active again
this.options.events['mouseup'] = function () {
  isPicking = false
}

// what happens when mouse is moving over the grey circle area
this.options.events['mousemove #locationCircle'] = function (event) {
  if (isPicking) {

    // set position of image to where the mouse is. it is for upper left corner of the image.
    document.getElementById('previewL').style.left = (event.clientX + offsetX) + "px"
    document.getElementById('previewL').style.top = (event.clientY + offsetY) + "px"

    // we need to take the relation to circle and take the center of object (now we subtract)
    this.parameters.imgPosXTest = (event.clientX + offsetX) - this.state.imgShift
    this.parameters.imgPosYTest = (event.clientY + offsetY) - this.state.imgShift

    // use pythagoras theorem to check for image movement on circle
    let imageRadius = Math.sqrt(Math.pow(this.parameters.imgPosXTest, 2) + Math.pow(this.parameters.imgPosYTest, 2));

    // set parameter for button visibility
    if (imageRadius > 120) {
      if (!isButtonVisible) {
        // I want the continue button to show.
        setVisibility('#cmt', true)
      }
    } else {
      if (isButtonVisible) {
        // I dont want the continue button to show.
        setVisibility('#cmt', false)
      }
    }

    // calculate angle in radians
    const locAngleRadians = Math.atan2(this.parameters.imgPosYTest, this.parameters.imgPosXTest)

    // transform from radians to degrees
    const locAngleDegrees = locAngleRadians * 180 / Math.PI

    // save location adjustments etc NOTE: IF YOU HAVE TWO COMPONENTS FOR LOCATION AND COLOUR, YOU COULD HAVE THE SAME VARIABLE NAMES. THEN IT WOULD BE SAVED IN THE SAME COLUMN BUT YOU CAN FILTER AFTER THE NAME OF THE COMPONENT LATER. YOU CAN ALSO FILTER FOR COMPONENT WHEN READING IT OUT OF THE DATASTORE FOR FEEDBACK LATER. 
    this.data.location_angle_study = this.parameters.theta
    this.data.location_angle_test = locAngleDegrees
    this.data.location_angle_deviation = (((this.data.location_angle_study - this.data.location_angle_test) + 180).mod(360)) - 180
    this.data.location_angle_abs_deviation = Math.abs(this.data.location_angle_deviation)
  }
}

// show forward button only when location adjustment has been made
const setVisibility = (selector, isVisible) => {
  // extract the content from the current element
  const target = this.options.el.querySelector(selector)
  target.style.visibility = isVisible ? 'visible' : 'hidden'
  isButtonVisible = isVisible ? true : false
}



},
                        "run": function anonymous(
) {
// present object in center at the beginning
document.getElementById('previewL').style.top  =  0 + this.state.imgShift  + "px"
document.getElementById('previewL').style.left =  0 + this.state.imgShift  + "px"

  

}
                      },
                      "title": "Location_Recall_STM5",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\n\n    \u003Cdiv class = \"pickparent\" style= \"\"\u003E\n         \u003Csvg class='pickpicker' height=\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\n        \n          \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\n          style=\"fill: #f2f2f2\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \n          style=\"fill: white\"\n        \u002F\u003E\n      \u003C\u002Fsvg\u003E\n    \n     \u003Cimg class='pickimage'id=\"previewL\" src=\"static\u002F${this.parameters.image}\"      \n       style = 'height: ${this.state.imgHeight + \"px\"}; pointer-events: none;'\u003E\n\n\n    \u003C\u002Fdiv\u003E\n\n\u003C\u002Fmain\u003E\n\n\u003Cfooter\u003E\n  \u003Cp id=\"fwd\"\u003E\n  Keep left mouse button pressed and move object to set LOCATION on circle.\n  \u003C\u002Fp\u003E\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\n    Confirm selected LOCATION and continue\n  \u003C\u002Fbutton\u003E\n\u003C\u002Ffooter\u003E",
                      "tardy": true,
                      "skip": "${this.state.counterbalancing != 2}"
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          "type": "lab.html.Page",
          "items": [
            {
              "type": "text",
              "title": "\u003Cheader\u003E \u003Ch1\u003EBreak \u003C\u002Fheader\u003E \u003C\u002Fh1\u003E",
              "content": "\u003Cdiv class= \"message\"\u003E\n\u003Cdiv\u003E\n  \u003Cspan id=\"halfway\" \u003E\u003C\u002Fspan\u003E\n\u003C\u002Fdiv\u003E\n"
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
document.getElementById('halfway').innerHTML = "<p> Well done! You are just over halfway through this block. </p> <p> Please take a short break before clicking 'Next' to continue. </p>";
}
          },
          "title": "Halfway_Break_Screen",
          "tardy": true
        },
        {
          "type": "lab.flow.Loop",
          "templateParameters": [
            {
              "trial": "39"
            },
            {
              "trial": "40"
            },
            {
              "trial": "41"
            },
            {
              "trial": "42"
            },
            {
              "trial": "43"
            },
            {
              "trial": "44"
            },
            {
              "trial": "45"
            }
          ],
          "sample": {
            "mode": "draw",
            "n": ""
          },
          "files": {},
          "responses": {},
          "parameters": {},
          "messageHandlers": {},
          "title": "Load_5",
          "shuffleGroups": [],
          "template": {
            "type": "lab.flow.Sequence",
            "files": {},
            "responses": {},
            "parameters": {},
            "messageHandlers": {
              "before:prepare": function anonymous(
) {
//prepare parameters that can be used later (therefore in state, not parameters) 

// prepare presentation of wheel (for location and color)
// radius for circles
this.state.radius  = window.scaling_rectx 
this.state.radius1 =  this.state.radius - 1 
this.state.radius2 =  this.state.radius - 20
this.state.radius3 =  this.state.radius - 21 // if you make this subtracted number larger, the grey area should increase

this.state.diameter = this.state.radius * 2

// prepare image size
this.state.imgHeight = window.scaling_rectx * 0.6 // we present image squared, so this is enough
// this.state.imgWidth = 180

// shift the image position by this value (so it is relative to the center of the circles)
this.state.imgShift = this.state.radius - this.state.imgHeight/2


}
            },
            "title": "Sequence",
            "content": [
              {
                "type": "lab.flow.Loop",
                "templateParameters": [
                  {
                    "trial_n": "39",
                    "block_n": "3",
                    "load_n": "5",
                    "image1": "image_199.png",
                    "hue1": "332",
                    "theta1": "197",
                    "image2": "image_196.png",
                    "hue2": "108",
                    "theta2": "319",
                    "image3": "image_198.png",
                    "hue3": "272",
                    "theta3": "12",
                    "image4": "image_197.png",
                    "hue4": "168",
                    "theta4": "247",
                    "image5": "image_195.png",
                    "hue5": "55",
                    "theta5": "88"
                  },
                  {
                    "trial_n": "40",
                    "block_n": "3",
                    "load_n": "5",
                    "image1": "image_200.png",
                    "hue1": "31",
                    "theta1": "24",
                    "image2": "image_202.png",
                    "hue2": "220",
                    "theta2": "333",
                    "image3": "image_201.png",
                    "hue3": "158",
                    "theta3": "107",
                    "image4": "image_204.png",
                    "hue4": "328",
                    "theta4": "164",
                    "image5": "image_203.png",
                    "hue5": "275",
                    "theta5": "248"
                  },
                  {
                    "trial_n": "41",
                    "block_n": "3",
                    "load_n": "5",
                    "image1": "image_207.png",
                    "hue1": "205",
                    "theta1": "96",
                    "image2": "image_206.png",
                    "hue2": "91",
                    "theta2": "170",
                    "image3": "image_205.png",
                    "hue3": "35",
                    "theta3": "32",
                    "image4": "image_209.png",
                    "hue4": "319",
                    "theta4": "317",
                    "image5": "image_208.png",
                    "hue5": "259",
                    "theta5": "233"
                  },
                  {
                    "trial_n": "42",
                    "block_n": "3",
                    "load_n": "5",
                    "image1": "image_212.png",
                    "hue1": "122",
                    "theta1": "261",
                    "image2": "image_214.png",
                    "hue2": "298",
                    "theta2": "156",
                    "image3": "image_211.png",
                    "hue3": "67",
                    "theta3": "209",
                    "image4": "image_210.png",
                    "hue4": "4",
                    "theta4": "71",
                    "image5": "image_213.png",
                    "hue5": "222",
                    "theta5": "360"
                  },
                  {
                    "trial_n": "43",
                    "block_n": "3",
                    "load_n": "5",
                    "image1": "image_216.png",
                    "hue1": "111",
                    "theta1": "75",
                    "image2": "image_217.png",
                    "hue2": "181",
                    "theta2": "24",
                    "image3": "image_215.png",
                    "hue3": "36",
                    "theta3": "140",
                    "image4": "image_219.png",
                    "hue4": "344",
                    "theta4": "206",
                    "image5": "image_218.png",
                    "hue5": "247",
                    "theta5": "331"
                  },
                  {
                    "trial_n": "44",
                    "block_n": "3",
                    "load_n": "5",
                    "image1": "image_224.png",
                    "hue1": "346",
                    "theta1": "218",
                    "image2": "image_221.png",
                    "hue2": "120",
                    "theta2": "95",
                    "image3": "image_223.png",
                    "hue3": "282",
                    "theta3": "326",
                    "image4": "image_222.png",
                    "hue4": "175",
                    "theta4": "31",
                    "image5": "image_220.png",
                    "hue5": "47",
                    "theta5": "149"
                  },
                  {
                    "trial_n": "45",
                    "block_n": "3",
                    "load_n": "5",
                    "image1": "image_226.png",
                    "hue1": "83",
                    "theta1": "63",
                    "image2": "image_228.png",
                    "hue2": "235",
                    "theta2": "224",
                    "image3": "image_227.png",
                    "hue3": "150",
                    "theta3": "284",
                    "image4": "image_225.png",
                    "hue4": "32",
                    "theta4": "342",
                    "image5": "image_229.png",
                    "hue5": "340",
                    "theta5": "144"
                  }
                ],
                "sample": {
                  "mode": "sequential",
                  "n": ""
                },
                "files": {},
                "responses": {},
                "parameters": {},
                "messageHandlers": {
                  "before:prepare": function anonymous(
) {
this.options.templateParameters = this.options.templateParameters.filter(row => row.trial_n == this.parameters.trial)
}
                },
                "title": "Encoding_Loop_load_5",
                "indexParameter": "counter",
                "shuffleGroups": [],
                "template": {
                  "type": "lab.flow.Sequence",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Encoding_Sequence",
                  "content": [
                    {
                      "type": "lab.html.Screen",
                      "files": {},
                      "responses": {},
                      "parameters": {},
                      "messageHandlers": {
                        "run": function anonymous(
) {
this.state.imgHeight

// transform the deg to radians (because of Math.cos and Math.sin)
var theta1 = this.parameters.theta1 * Math.PI/180;
var theta2 = this.parameters.theta2 * Math.PI/180;
var theta3 = this.parameters.theta3 * Math.PI/180;
var theta4 = this.parameters.theta4 * Math.PI/180;
var theta5 = this.parameters.theta5 * Math.PI/180;

// calculate x and y coordinates. coordinates are shifted in relation to center of the viewbox / circle and corresponding to center of the image
var xPos = (this.state.radius * Math.cos(theta1)) + this.state.imgShift;
var yPos = (this.state.radius * Math.sin(theta1)) + this.state.imgShift;

var xPos2 = (this.state.radius * Math.cos(theta2)) + this.state.imgShift;
var yPos2 = (this.state.radius * Math.sin(theta2)) + this.state.imgShift;

var xPos3 = (this.state.radius * Math.cos(theta3)) + this.state.imgShift;
var yPos3 = (this.state.radius * Math.sin(theta3)) + this.state.imgShift;

var xPos4 = (this.state.radius * Math.cos(theta4)) + this.state.imgShift;
var yPos4 = (this.state.radius * Math.sin(theta4)) + this.state.imgShift;

var xPos5 = (this.state.radius * Math.cos(theta5)) + this.state.imgShift;
var yPos5 = (this.state.radius * Math.sin(theta5)) + this.state.imgShift;

// save coordinates
this.options.datastore.set('imgPosX', xPos);
this.options.datastore.set('imgPosY', yPos);

this.options.datastore.set('imgPosX', xPos2);
this.options.datastore.set('imgPosY', yPos2);

this.options.datastore.set('imgPosX', xPos3);
this.options.datastore.set('imgPosY', yPos3);

this.options.datastore.set('imgPosX', xPos4);
this.options.datastore.set('imgPosY', yPos4);

this.options.datastore.set('imgPosX', xPos5);
this.options.datastore.set('imgPosY', yPos5);

// set image positions and visibility
var image1 = document.getElementById('image1');
if (this.parameters.image1) {
  image1.style.left = xPos + 'px';
  image1.style.top = yPos + 'px';
  image1.style.visibility = 'visible';
} else {
  image1.style.visibility = 'hidden';
}

var image2 = document.getElementById('image2');
if (this.parameters.image2) {
  image2.style.left = xPos2 + 'px';
  image2.style.top = yPos2 + 'px';
  image2.style.visibility = 'visible';
} else {
  image2.style.visibility = 'hidden';
}

var image3 = document.getElementById('image3');
if (this.parameters.image3) {
  image3.style.left = xPos3 + 'px';
  image3.style.top = yPos3 + 'px';
  image3.style.visibility = 'visible';
} else {
  image3.style.visibility = 'hidden';
}

var image4 = document.getElementById('image4');
if (this.parameters.image4) {
  image4.style.left = xPos4 + 'px';
  image4.style.top = yPos4 + 'px';
  image4.style.visibility = 'visible';
} else {
  image4.style.visibility = 'hidden';
}

var image5 = document.getElementById('image5');
if (this.parameters.image5) {
  image5.style.left = xPos5 + 'px';
  image5.style.top = yPos5 + 'px';
  image5.style.visibility = 'visible';
} else {
  image5.style.visibility = 'hidden';
}

}
                      },
                      "title": "Encoding_Screen",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n\r\n  \u003Cdiv class = \"pickparent\" style= \"\"\u003E\r\n     \u003Csvg class=\"pickpicker\"\r\n          height =\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" \r\n          viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\r\n          \u003C!–– keep scaling similar for object with: preserveAspectRatio =\"xMinYMin meet\", put it back bfore viewbox if needed --\u003E\r\n       \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\r\n          style=\"fill: #f2f2f2\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \r\n          style=\"fill: white\"\r\n        \u002F\u003E\r\n      \u003C\u002Fsvg\u003E\r\n\r\n      \u003Cimg id=\"image1\" class='pickimage' src=\"static\u002F${this.parameters.image1}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue1}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image2\" class='pickimage' src=\"static\u002F${this.parameters.image2}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue2}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image3\" class='pickimage' src=\"static\u002F${this.parameters.image3}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue3}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image4\" class='pickimage' src=\"static\u002F${this.parameters.image4}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue4}deg)'\u003E\r\n\r\n      \u003Cimg id=\"image5\" class='pickimage' src=\"static\u002F${this.parameters.image5}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue5}deg)'\u003E\r\n\r\n  \u003C\u002Fdiv\u003E\r\n\r\n\u003C\u002Fmain\u003E\r\n\r\n  \u003Cfooter\u003E\r\n  \u003Cp id=\"fwd\"\u003E\r\n \r\n  \u003C\u002Fp\u003E\r\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\r\n    I'm just here for similar footer\r\n\u003Cbr\u003E\r\n\u003Cbr\u003E\r\n\u003Cbr\u003E\r\n  \u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E\r\n\r\n\r\n",
                      "tardy": true,
                      "timeout": "3000"
                    },
                    {
                      "type": "lab.html.Screen",
                      "files": {},
                      "responses": {},
                      "parameters": {},
                      "messageHandlers": {},
                      "title": "Retention_interval",
                      "timeout": "1000"
                    }
                  ]
                }
              },
              {
                "type": "lab.flow.Loop",
                "templateParameters": [
                  {
                    "trial_n": "39",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_195.png",
                    "hue": "55",
                    "theta": "88"
                  },
                  {
                    "trial_n": "39",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_196.png",
                    "hue": "108",
                    "theta": "319"
                  },
                  {
                    "trial_n": "39",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_197.png",
                    "hue": "168",
                    "theta": "247"
                  },
                  {
                    "trial_n": "39",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_198.png",
                    "hue": "272",
                    "theta": "12"
                  },
                  {
                    "trial_n": "39",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_199.png",
                    "hue": "332",
                    "theta": "197"
                  },
                  {
                    "trial_n": "40",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_200.png",
                    "hue": "31",
                    "theta": "24"
                  },
                  {
                    "trial_n": "40",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_201.png",
                    "hue": "158",
                    "theta": "107"
                  },
                  {
                    "trial_n": "40",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_202.png",
                    "hue": "220",
                    "theta": "333"
                  },
                  {
                    "trial_n": "40",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_203.png",
                    "hue": "275",
                    "theta": "248"
                  },
                  {
                    "trial_n": "40",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_204.png",
                    "hue": "328",
                    "theta": "164"
                  },
                  {
                    "trial_n": "41",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_205.png",
                    "hue": "35",
                    "theta": "32"
                  },
                  {
                    "trial_n": "41",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_206.png",
                    "hue": "91",
                    "theta": "170"
                  },
                  {
                    "trial_n": "41",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_207.png",
                    "hue": "205",
                    "theta": "96"
                  },
                  {
                    "trial_n": "41",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_208.png",
                    "hue": "259",
                    "theta": "233"
                  },
                  {
                    "trial_n": "41",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_209.png",
                    "hue": "319",
                    "theta": "317"
                  },
                  {
                    "trial_n": "42",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_210.png",
                    "hue": "4",
                    "theta": "71"
                  },
                  {
                    "trial_n": "42",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_211.png",
                    "hue": "67",
                    "theta": "209"
                  },
                  {
                    "trial_n": "42",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_212.png",
                    "hue": "122",
                    "theta": "261"
                  },
                  {
                    "trial_n": "42",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_213.png",
                    "hue": "222",
                    "theta": "360"
                  },
                  {
                    "trial_n": "42",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_214.png",
                    "hue": "298",
                    "theta": "156"
                  },
                  {
                    "trial_n": "43",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_215.png",
                    "hue": "36",
                    "theta": "140"
                  },
                  {
                    "trial_n": "43",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_216.png",
                    "hue": "111",
                    "theta": "75"
                  },
                  {
                    "trial_n": "43",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_217.png",
                    "hue": "181",
                    "theta": "24"
                  },
                  {
                    "trial_n": "43",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_218.png",
                    "hue": "247",
                    "theta": "331"
                  },
                  {
                    "trial_n": "43",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_219.png",
                    "hue": "344",
                    "theta": "206"
                  },
                  {
                    "trial_n": "44",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_220.png",
                    "hue": "47",
                    "theta": "149"
                  },
                  {
                    "trial_n": "44",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_221.png",
                    "hue": "120",
                    "theta": "95"
                  },
                  {
                    "trial_n": "44",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_222.png",
                    "hue": "175",
                    "theta": "31"
                  },
                  {
                    "trial_n": "44",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_223.png",
                    "hue": "282",
                    "theta": "326"
                  },
                  {
                    "trial_n": "44",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_224.png",
                    "hue": "346",
                    "theta": "218"
                  },
                  {
                    "trial_n": "45",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_225.png",
                    "hue": "32",
                    "theta": "342"
                  },
                  {
                    "trial_n": "45",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_226.png",
                    "hue": "83",
                    "theta": "63"
                  },
                  {
                    "trial_n": "45",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_227.png",
                    "hue": "150",
                    "theta": "284"
                  },
                  {
                    "trial_n": "45",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_228.png",
                    "hue": "235",
                    "theta": "224"
                  },
                  {
                    "trial_n": "45",
                    "block_n": "3",
                    "load_n": "5",
                    "image": "image_229.png",
                    "hue": "340",
                    "theta": "144"
                  }
                ],
                "sample": {
                  "mode": "sequential",
                  "n": "5"
                },
                "files": {},
                "responses": {},
                "parameters": {},
                "messageHandlers": {
                  "before:prepare": function anonymous(
) {
this.parameters.practice = "no"

this.options.templateParameters = this.options.templateParameters.filter(row => row.trial_n == this.parameters.trial)
}
                },
                "title": "Recall_Loop_load_5",
                "shuffleGroups": [],
                "template": {
                  "type": "lab.flow.Sequence",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Recall_Sequence_load_5",
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
// prepare modulus function
Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
}

// no picking when mouse is not active
let isPicking = false

// introduce global variable for button visibility state
let isButtonVisible = false

// function to get position during mousedown. set picking to active
this.options.events['mousedown'] = function (e) {
  isPicking = true // need to get position already here
  offsetX = document.getElementById('previewL').offsetLeft - e.clientX
  offsetY = document.getElementById('previewL').offsetTop - e.clientY
}

// when mouse is released, picking is not active again
this.options.events['mouseup'] = function () {
  isPicking = false
}

// what happens when mouse is moving over the grey circle area
this.options.events['mousemove #locationCircle'] = function (event) {
  if (isPicking) {

    // set position of image to where the mouse is. it is for upper left corner of the image.
    document.getElementById('previewL').style.left = (event.clientX + offsetX) + "px"
    document.getElementById('previewL').style.top = (event.clientY + offsetY) + "px"

    // we need to take the relation to circle and take the center of object (now we subtract)
    this.parameters.imgPosXTest = (event.clientX + offsetX) - this.state.imgShift
    this.parameters.imgPosYTest = (event.clientY + offsetY) - this.state.imgShift

    // use pythagoras theorem to check for image movement on circle
    let imageRadius = Math.sqrt(Math.pow(this.parameters.imgPosXTest, 2) + Math.pow(this.parameters.imgPosYTest, 2));

    // set parameter for button visibility
    if (imageRadius > 120) {
      if (!isButtonVisible) {
        // I want the continue button to show.
        setVisibility('#cmt', true)
      }
    } else {
      if (isButtonVisible) {
        // I dont want the continue button to show.
        setVisibility('#cmt', false)
      }
    }

    // calculate angle in radians
    const locAngleRadians = Math.atan2(this.parameters.imgPosYTest, this.parameters.imgPosXTest)

    // transform from radians to degrees
    const locAngleDegrees = locAngleRadians * 180 / Math.PI

    // save location adjustments etc NOTE: IF YOU HAVE TWO COMPONENTS FOR LOCATION AND COLOUR, YOU COULD HAVE THE SAME VARIABLE NAMES. THEN IT WOULD BE SAVED IN THE SAME COLUMN BUT YOU CAN FILTER AFTER THE NAME OF THE COMPONENT LATER. YOU CAN ALSO FILTER FOR COMPONENT WHEN READING IT OUT OF THE DATASTORE FOR FEEDBACK LATER. 
    this.data.location_angle_study = this.parameters.theta
    this.data.location_angle_test = locAngleDegrees
    this.data.location_angle_deviation = (((this.data.location_angle_study - this.data.location_angle_test) + 180).mod(360)) - 180
    this.data.location_angle_abs_deviation = Math.abs(this.data.location_angle_deviation)
  }
}

// show forward button only when location adjustment has been made
const setVisibility = (selector, isVisible) => {
  // extract the content from the current element
  const target = this.options.el.querySelector(selector)
  target.style.visibility = isVisible ? 'visible' : 'hidden'
  isButtonVisible = isVisible ? true : false
}



},
                        "run": function anonymous(
) {
// present object in center at the beginning
document.getElementById('previewL').style.top  =  0 + this.state.imgShift  + "px"
document.getElementById('previewL').style.left =  0 + this.state.imgShift  + "px"

  

}
                      },
                      "title": "Location_Recall_STM5",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\n\n    \u003Cdiv class = \"pickparent\" style= \"\"\u003E\n         \u003Csvg class='pickpicker' height=\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\n        \n          \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\n          style=\"fill: #f2f2f2\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \n          style=\"fill: white\"\n        \u002F\u003E\n      \u003C\u002Fsvg\u003E\n    \n     \u003Cimg class='pickimage'id=\"previewL\" src=\"static\u002F${this.parameters.image}\"      \n       style = 'height: ${this.state.imgHeight + \"px\"}; pointer-events: none;'\u003E\n\n\n    \u003C\u002Fdiv\u003E\n\n\u003C\u002Fmain\u003E\n\n\u003Cfooter\u003E\n  \u003Cp id=\"fwd\"\u003E\n  Keep left mouse button pressed and move object to set LOCATION on circle.\n  \u003C\u002Fp\u003E\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\n    Confirm selected LOCATION and continue\n  \u003C\u002Fbutton\u003E\n\u003C\u002Ffooter\u003E",
                      "tardy": true,
                      "skip": "${this.state.counterbalancing != 1}"
                    },
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
Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
}

let isPicking = false

// set dummy to hide / present button
let dummy_button = 999

this.options.events['mousedown'] = function() {
  isPicking = true
}

this.options.events['mouseup'] = function() {
  isPicking = false
}

// create random offset between -180 and +180
offset = Math.random() * 360 -180

this.options.events['mousemove #colorCircle'] = function(event) {
  if (isPicking) {
    // extract click coordinates from event,
    // and make them relative to the circle center by subtracting radius-imgHeight
    this.parameters.colX = event.offsetX - this.state.imgShift 
    this.parameters.colY = event.offsetY - this.state.imgShift 

    // compute angle
    const angleRadians = Math.atan2(this.parameters.colY, this.parameters.colX)

    // transform from radians to degrees
    const angleDegrees = angleRadians * 180 / Math.PI

    // randomly shift location of colors on color circle
    const colorAngle = (((angleDegrees + offset) + 180).mod(360)) - 180

    // apply color to preview image using hue-rotate
    const preview = this.options.el.querySelector('#preview')
    preview.style.filter = `hue-rotate(${ colorAngle }deg)`
    
    // note that mouse was moved to show button
    dummy_button = 1
    
    // save color adjustments etc. IF YOU HAVE TWO COMPONENTS FOR LOCATION AND COLOUR, YOU COULD HAVE THE SAME VARIABLE NAMES. THEN IT WOULD BE SAVED IN THE SAME COLUMN BUT YOU CAN FILTER AFTER THE NAME OF THE COMPONENT LATER. YOU CAN ALSO FILTER FOR COMPONENT WHEN READING IT OUT OF THE DATASTORE FOR FEEDBACK LATER. 
    this.data.color_offset = offset
    this.data.color_angle_study = this.parameters.hue
    this.data.color_angle_test = colorAngle
    this.data.color_angle_deviation = (((this.data.color_angle_study - this.data.color_angle_test) + 180).mod(360)) - 180
    this.data.color_angle_abs_deviation = Math.abs(this.data.color_angle_deviation)

  }

}

// show forward button only when color adjustment has been made

const setVisibility = (selector, isVisible) => {
  // Extract the content from the current element
  const target = this.options.el.querySelector(selector)
  target.style.visibility = isVisible ? 'visible' : 'hidden'
}

this.options.events['mousemove'] = function(){ 
// make sure a color has been selected
if(dummy_button != 999) {
  setVisibility('#cmt', true) // make sure that button is visible
  }
}
},
                        "run": function anonymous(
) {
// present image in center 
document.getElementById('preview').style.top  =  0 + this.state.imgShift + "px"
document.getElementById('preview').style.left =  0 + this.state.imgShift + "px"

}
                      },
                      "title": "Colour_Recall_STM5",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n\r\n    \u003Cdiv class='pickparent' style=''\u003E\r\n      \u003Csvg class='pickpicker' height=\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\r\n        \r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\r\n          style=\"fill: #f2f2f2\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \r\n          style=\"fill: white\"\r\n        \u002F\u003E\r\n      \u003C\u002Fsvg\u003E\r\n      \u003Cimg class='pickimage' id=\"preview\" src='static\u002F${this.parameters.image}' style = 'height: ${this.state.imgHeight + \"px\"}; pointer-events: none;'\u003E  \r\n    \u003C\u002Fdiv\u003E\r\n\r\n\u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n  \u003Cp id=\"fwd\"\u003E\r\n  Keep left mouse button pressed and move mouse over circle to set COLOUR.\r\n  \u003C\u002Fp\u003E\r\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\r\n    Confirm selected COLOUR and continue\r\n  \u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E",
                      "tardy": true
                    },
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
// prepare modulus function
Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
}

// no picking when mouse is not active
let isPicking = false

// introduce global variable for button visibility state
let isButtonVisible = false

// function to get position during mousedown. set picking to active
this.options.events['mousedown'] = function (e) {
  isPicking = true // need to get position already here
  offsetX = document.getElementById('previewL').offsetLeft - e.clientX
  offsetY = document.getElementById('previewL').offsetTop - e.clientY
}

// when mouse is released, picking is not active again
this.options.events['mouseup'] = function () {
  isPicking = false
}

// what happens when mouse is moving over the grey circle area
this.options.events['mousemove #locationCircle'] = function (event) {
  if (isPicking) {

    // set position of image to where the mouse is. it is for upper left corner of the image.
    document.getElementById('previewL').style.left = (event.clientX + offsetX) + "px"
    document.getElementById('previewL').style.top = (event.clientY + offsetY) + "px"

    // we need to take the relation to circle and take the center of object (now we subtract)
    this.parameters.imgPosXTest = (event.clientX + offsetX) - this.state.imgShift
    this.parameters.imgPosYTest = (event.clientY + offsetY) - this.state.imgShift

    // use pythagoras theorem to check for image movement on circle
    let imageRadius = Math.sqrt(Math.pow(this.parameters.imgPosXTest, 2) + Math.pow(this.parameters.imgPosYTest, 2));

    // set parameter for button visibility
    if (imageRadius > 120) {
      if (!isButtonVisible) {
        // I want the continue button to show.
        setVisibility('#cmt', true)
      }
    } else {
      if (isButtonVisible) {
        // I dont want the continue button to show.
        setVisibility('#cmt', false)
      }
    }

    // calculate angle in radians
    const locAngleRadians = Math.atan2(this.parameters.imgPosYTest, this.parameters.imgPosXTest)

    // transform from radians to degrees
    const locAngleDegrees = locAngleRadians * 180 / Math.PI

    // save location adjustments etc NOTE: IF YOU HAVE TWO COMPONENTS FOR LOCATION AND COLOUR, YOU COULD HAVE THE SAME VARIABLE NAMES. THEN IT WOULD BE SAVED IN THE SAME COLUMN BUT YOU CAN FILTER AFTER THE NAME OF THE COMPONENT LATER. YOU CAN ALSO FILTER FOR COMPONENT WHEN READING IT OUT OF THE DATASTORE FOR FEEDBACK LATER. 
    this.data.location_angle_study = this.parameters.theta
    this.data.location_angle_test = locAngleDegrees
    this.data.location_angle_deviation = (((this.data.location_angle_study - this.data.location_angle_test) + 180).mod(360)) - 180
    this.data.location_angle_abs_deviation = Math.abs(this.data.location_angle_deviation)
  }
}

// show forward button only when location adjustment has been made
const setVisibility = (selector, isVisible) => {
  // extract the content from the current element
  const target = this.options.el.querySelector(selector)
  target.style.visibility = isVisible ? 'visible' : 'hidden'
  isButtonVisible = isVisible ? true : false
}



},
                        "run": function anonymous(
) {
// present object in center at the beginning
document.getElementById('previewL').style.top  =  0 + this.state.imgShift  + "px"
document.getElementById('previewL').style.left =  0 + this.state.imgShift  + "px"

  

}
                      },
                      "title": "Location_Recall_STM5",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\n\n    \u003Cdiv class = \"pickparent\" style= \"\"\u003E\n         \u003Csvg class='pickpicker' height=\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\n        \n          \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\n          style=\"fill: #f2f2f2\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \n          style=\"fill: white\"\n        \u002F\u003E\n      \u003C\u002Fsvg\u003E\n    \n     \u003Cimg class='pickimage'id=\"previewL\" src=\"static\u002F${this.parameters.image}\"      \n       style = 'height: ${this.state.imgHeight + \"px\"}; pointer-events: none;'\u003E\n\n\n    \u003C\u002Fdiv\u003E\n\n\u003C\u002Fmain\u003E\n\n\u003Cfooter\u003E\n  \u003Cp id=\"fwd\"\u003E\n  Keep left mouse button pressed and move object to set LOCATION on circle.\n  \u003C\u002Fp\u003E\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\n    Confirm selected LOCATION and continue\n  \u003C\u002Fbutton\u003E\n\u003C\u002Ffooter\u003E",
                      "tardy": true,
                      "skip": "${this.state.counterbalancing != 2}"
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          "type": "lab.html.Screen",
          "files": {},
          "responses": {
            "click button": "Next"
          },
          "parameters": {},
          "messageHandlers": {
            "run": function anonymous(
) {
// Get the circle indicator elements
const locationIndicator = document.getElementById('locationIndicator');
const colorIndicator = document.getElementById('colorIndicator');

// filter by Location_Recall
const location_filtered_data = this.options.datastore.data.filter(
  row => row.sender === 'Location_Recall_STM5' && row.ended_on !== 'skipped' && row.block === this.parameters.block
);

// filter by Colour_Recall
const color_filtered_data = this.options.datastore.data.filter(
  row => row.sender === 'Colour_Recall_STM5' && row.ended_on !== 'skipped' && row.block === this.parameters.block
);

// Calculate average deviation for Location_Recall
const locationTotalRows = location_filtered_data.length;
const locationDeviationSum = location_filtered_data.reduce((sum, row) => sum + Math.abs(row.location_angle_abs_deviation), 0);
const locationAverageDeviation = locationTotalRows === 0 ? 0 : locationDeviationSum / locationTotalRows;

// Calculate average deviation for Colour_Recall
const colorTotalRows = color_filtered_data.length;
const colorDeviationSum = color_filtered_data.reduce((sum, row) => sum + Math.abs(row.color_angle_abs_deviation), 0);
const colorAverageDeviation = colorTotalRows === 0 ? 0 : colorDeviationSum / colorTotalRows;

// Take the square root of the average deviations
const sqrtLocationAverageDeviation = Math.sqrt(locationAverageDeviation);
const sqrtColorAverageDeviation = Math.sqrt(colorAverageDeviation);

// Calculate the position of the circle indicators
const locationIndicatorPosition = (sqrtLocationAverageDeviation / Math.sqrt(180)) * 100;
const colorIndicatorPosition = (sqrtColorAverageDeviation / Math.sqrt(180)) * 100;

// Set the position of the circle indicators
locationIndicator.style.left = `${locationIndicatorPosition}%`;
colorIndicator.style.left = `${colorIndicatorPosition}%`;

skillsContainer1.style.transform = "scale("+window.scaling_rectx*0.004+")";
skillsContainer2.style.transform = "scale("+window.scaling_rectx*0.004+")";



}
          },
          "title": "Block_Feedback_Screen",
          "content": " \u003Cdiv class=\"centered-container\"\u003E\r\n \u003Cdiv class=\"block-feedback\"\u003E\r\n    \u003Ch1 style=\"text-align: center; font-size: 28px;\"\u003EFeedback\u003C\u002Fh1\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\r\n  \u003Cdiv class=\"skills-container\" id=\"skillsContainer1\"\u003E\r\n    \u003Cp style = \"font-size: 28px\" id=\"fontLocation\"\u003ELocation:\u003C\u002Fp\u003E\r\n    \u003Cdiv class=\"skills-bar\"\u003E\r\n      \u003Cdiv class=\"skills-range\"\u003E\u003C\u002Fdiv\u003E\r\n      \u003Cdiv class=\"indicator-circle\" id=\"locationIndicator\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n    \u003Cp class=\"skills-label\" style=\"font-size:50px; color: green; font-weight: bold;\"\u003E&#x2713\u003C\u002Fp\u003E\r\n    \u003Cp class=\"skills-max-label\" style=\"font-size:50px; color: red; font-weight: bold;\"\u003E&#x2717\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\r\n  \u003Cdiv class=\"skills-container\" id=\"skillsContainer2\"\u003E\r\n    \u003Cp style = \"font-size: 28px\"\u003EColour:\u003C\u002Fp\u003E\r\n    \u003Cdiv class=\"skills-bar\"\u003E\r\n      \u003Cdiv class=\"skills-range\"\u003E\u003C\u002Fdiv\u003E\r\n      \u003Cdiv class=\"indicator-circle\" id=\"colorIndicator\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n    \u003Cp class=\"skills-label\" style=\"font-size:50px; color: green; font-weight: bold;\"\u003E&#x2713\u003C\u002Fp\u003E\r\n    \u003Cp class=\"skills-max-label\" style=\"font-size:50px; color: red; font-weight: bold;\"\u003E&#x2717\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n\u003Cfooter style=\"position: absolute; width: calc(100% - 2.4%); bottom: 1.2%; left: 1.2%; right: 1.2%; text-align: center;\"\u003E\r\n    \u003Cbutton id=\"buttonSubmit\"\u003ENext→\u003C\u002Fbutton\u003E\r\n  \u003C\u002Ffooter\u003E\r\n",
          "tardy": true
        },
        {
          "type": "lab.html.Page",
          "items": [
            {
              "type": "text",
              "title": "\u003Cheader\u003E \u003Ch1\u003EBreak \u003C\u002Fheader\u003E \u003C\u002Fh1\u003E",
              "content": "\u003Cdiv class= \"message\"\u003E\n\u003Cdiv\u003E\n  \u003Cspan id=\"endMessage_load5\" \u003E\u003C\u002Fspan\u003E\n\u003C\u002Fdiv\u003E\n"
            }
          ],
          "scrollTop": true,
          "submitButtonText": "Next→",
          "submitButtonPosition": "right",
          "files": {},
          "responses": {
            "click button": "continue"
          },
          "parameters": {},
          "messageHandlers": {
            "run": function anonymous(
) {
document.getElementById('endMessage_load5').innerHTML = "<p> Great! You have now completed the memory task. </p> <p> Click 'Next' when you are ready to move on to the questionnaires. </p>";
}
          },
          "title": "Block_Break_Screen",
          "tardy": true
        },
        {
          "type": "lab.flow.Sequence",
          "files": {},
          "responses": {},
          "parameters": {},
          "messageHandlers": {},
          "title": "SCSQ_Sequence",
          "content": [
            {
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "html",
                  "content": "    \u003Cstyle\u003E\r\n        body, html {\r\n            margin: 0;\r\n            padding: 0;\r\n            height: 100%;\r\n            min-height: 100vh;\r\n            font-family: Arial, sans-serif;\r\n        }\r\n\r\n        .header-title {\r\n            margin-top: 20px;\r\n            text-align: center;\r\n        }\r\n\r\n        .labjs-question {\r\n            width: 600px;\r\n            margin: 10px auto;\r\n        }\r\n\r\n        \u002F* Style the anchors to align properly *\u002F\r\n        .labjs-item {\r\n            display: flex;\r\n            justify-content: space-between;\r\n            align-items: center;\r\n            margin-bottom: 20px;\r\n        }\r\n\r\n        .labjs-item label {\r\n            flex: 1;\r\n        }\r\n\r\n        .labjs-item select {\r\n            flex: 0 0 100px; \u002F* Adjust width as needed *\u002F\r\n        }\r\n\r\n        .scale-width {\r\n            display: flex;\r\n            justify-content: space-between;\r\n        }\r\n\r\n        .scale-width div {\r\n            width: calc(100% \u002F 5); \u002F* Adjust based on number of anchors *\u002F\r\n            text-align: center;\r\n        }\r\n    \u003C\u002Fstyle\u003E\r\n\u003C\u002Fhead\u003E\r\n\u003Cbody\u003E\r\n    \u003Cdiv class=\"header-title\"\u003E\r\n            \u003Ch1\u003EThinking Styles Questionnaire\u003C\u002Fh1\u003E\r\n            \u003Cp\u003EPlease use the scale below to submit your answers. There are 60 statements to answer in total.\u003C\u002Fp\u003E \u003Cbr\u003E\r\n            \u003Ch3\u003E How much do you disagree or agree with the following statements? \u003C\u002Fh3\u003E\r\n    \u003C\u002Fdiv\u003E\r\n\r\n    \u003Cdiv class=\"labjs-question\"\u003E\r\n        \u003C!-- Lab.js items are dynamically inserted here --\u003E\r\n    \u003C\u002Fdiv\u003E\r\n\u003C\u002Fbody\u003E\r\n\r\n",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "likert",
                  "items": [
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E1. I enjoy learning languages.\u003C\u002Fp\u003E",
                      "coding": "Q1"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E2. I find it difficult to imagine how a three-dimensional geometric figure would exactly look like when rotated.",
                      "coding": "Q2"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E 3.  I am interested in knowing the path a river takes from its source to the sea.",
                      "coding": "Q3"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E4. My mental images are more schematic than colourful and pictorial.",
                      "coding": "Q4"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E5.  When I'm planning to do a complex or difficult task, I visualise myself doing it first.",
                      "coding": "Q5"
                    },
                    {
                      "coding": "Q6",
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E6. When I read something, I always notice whether it is grammatically correct."
                    },
                    {
                      "coding": "Q7",
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E7. I have only vague visual impressions of scenes I have experienced."
                    },
                    {
                      "coding": "Q8",
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E8. In maths, I am intrigued by the rules and patterns governing numbers."
                    },
                    {
                      "coding": "Q9",
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E9. When remembering a scene, I use verbal descriptions rather than mental pictures."
                    },
                    {
                      "coding": "Q10",
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E10. When I think of historical events, the exact date is important to me."
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E11.  I can easily remember a great deal of visual details that someone else might never notice. For example, I would just automatically take some things in, like what colour is a shirt someone wears or what colour are his\u002Fher shoes.",
                      "coding": "Q11"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E12.  I tend to focus on details in a scene rather than the whole picture.",
                      "coding": "Q12"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E13.  I am good in playing spatial games involving constructing from blocks and paper (e.g. Lego, Tetris, Origami).",
                      "coding": "Q13"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E14. In school, I had no problems with geometry.",
                      "coding": "Q14"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E15. When I picture the route somewhere, I visualise that route as if I were walking\u002Fdriving\u002Fcycling it. ",
                      "coding": "Q15"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E16. Order is important to me.",
                      "coding": "Q16"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E17. I like to group things together under a single label.",
                      "coding": "Q17"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E18. I often enjoy the use of mental pictures to reminisce.",
                      "coding": "Q18"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E19. When I hear a radio announcer or a DJ I’ve never actually seen, I usually find myself picturing what he or she might look like.",
                      "coding": "Q19"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E20. When I am walking in the country, I am curious about how the various kinds of trees differ.",
                      "coding": "Q20"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E21. I don't usually notice small changes in a situation or a person's appearance.",
                      "coding": "Q21"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E22. When I think of a face, I imagine it as a whole. ",
                      "coding": "Q22"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E23.  I am fascinated by dates.",
                      "coding": "Q23"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E24. When I look at an animal, I like to know the precise species it belongs to.",
                      "coding": "Q24"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E25.  I find it easy to grasp exactly how odds work.",
                      "coding": "Q25"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E26. When I hear a new word, I am curious to know how it is spelled.",
                      "coding": "Q26"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E27. I am fascinated by numbers.",
                      "coding": "Q27"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E28. My mental images are very vivid and photographic.",
                      "coding": "Q28"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E29. I keep my book collection organised alphabetically.",
                      "coding": "Q29"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E30. I can easily sketch a blueprint for a building I am familiar with.",
                      "coding": "Q30"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E31. I can easily imagine and mentally rotate three-dimensional geometric figures.",
                      "coding": "Q31"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E32. My graphic abilities would make a career in architecture relatively easy for me.",
                      "coding": "Q32"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E33.  I can close my eyes and easily picture a scene that I have experienced.",
                      "coding": "Q33"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E34. I prefer schematic diagrams and sketches when reading a textbook instead of colourful and pictorial illustrations.",
                      "coding": "Q34"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E35.  I find it easy to group things together under a single label.",
                      "coding": "Q35"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E36. When thinking about an abstract concept (or building), I imagine an abstract schematic building in my mind or its blueprint rather than a specific concrete building.",
                      "coding": "Q36"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E37. I like learning new words.",
                      "coding": "Q37"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E38. I do not enjoy games that involve a high degree of strategy.",
                      "coding": "Q38"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E39. When I can't find something I'm looking for, I automatically visualise the last place I saw it.",
                      "coding": "Q39"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E40. If I had a collection (e.g. CDs, coins, stamps), it would be highly organised.",
                      "coding": "Q40"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E41. When I look at a tree I focus on its features such as branches and leaves rather than the whole.",
                      "coding": "Q41"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E42. When I read the newspaper, I am drawn to tables of information, such as football league scores or stock market indices.",
                      "coding": "Q42"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E43.  My memories are mainly visual in nature.",
                      "coding": "Q43"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E44. I notice patterns in things all the time.",
                      "coding": "Q44"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E45.  I tend to omit small visual details in scenes I remember.",
                      "coding": "Q45"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E46. I do not care to know the names of the plants I see.",
                      "coding": "Q46"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E47. When reading fiction, I usually form a clear and detailed mental picture of a scene or room that has been described.",
                      "coding": "Q47"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E48. If I were buying a stereo, I would want to know about its precise technical features.",
                      "coding": "Q48"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E49. I often use mental images or pictures to help me remember things.",
                      "coding": "Q49"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E50. Mental imagery helps me remember things.",
                      "coding": "Q50"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E51. I tend to notice if a word has the same letter repeated in its spelling.",
                      "coding": "Q51"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E52. I tend to notice details that others do not.",
                      "coding": "Q52"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E53.  I have excellent abilities in technical graphics.",
                      "coding": "Q53"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E54. The spelling of words does not fascinate me.",
                      "coding": "Q54"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E55.  I usually concentrate on the whole picture, rather than the small details.",
                      "coding": "Q55"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E56. When entering a familiar store to get a specific item, I can easily picture the exact location of the target item, the shelf it stands on, how it is arranged and the surrounding articles.",
                      "coding": "Q56"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E57. I keep my workspace highly organised (e.g. all files\u002Ffolders on the same subject are in the same colour).",
                      "coding": "Q57"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E58. If I were buying a computer, I would want to know exact details about its hard drive capacity and processor speed.",
                      "coding": "Q58"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E59. My mental images of different objects very much resemble the size, shape and colour of actual objects that I have seen.",
                      "coding": "Q59"
                    },
                    {
                      "label": "\u003Cp style=\"width: 400px; text-align: left; \"\u003E60. When I think of activities I have done, I do not remember in mental pictures.",
                      "coding": "Q60"
                    }
                  ],
                  "width": "5",
                  "anchors": [
                    "Strongly disagree",
                    "Disagree",
                    "Neither Agree nor Disagree",
                    "Agree",
                    "Strongly Agree"
                  ],
                  "name": "SCSQ",
                  "label": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E "
                }
              ],
              "scrollTop": true,
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {},
              "parameters": {},
              "messageHandlers": {},
              "title": "SCSQ",
              "width": "l"
            }
          ]
        },
        {
          "type": "lab.html.Page",
          "items": [
            {
              "type": "text",
              "title": "\u003Ch1 style=\"text-align: center;\"\u003EThank you for completing the \"Thinking Styles\" questionnaire. \u003C\u002Fh1\u003E",
              "content": "\u003Cp class=\"alert alter-warning\" style=\"font-size: 20px;\"\u003EThe final questionnaire is about what motivated you to complete the research. Click \"Next\" to move on. \u003C\u002Fp\u003E"
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
// Filter by sender name 'SCSQ'
const SCSQ_filtered_data = this.options.datastore.data.filter(
  row => row.sender === 'SCSQ'); 

// Initialize a combined row to store all 'SCSQ' data
const combinedSCSQ = {
  sender: 'combined_SCSQ',
  // Add other properties as needed
};

// Combine 'SCSQ' rows into the combined row
SCSQ_filtered_data.forEach(row => {
  for (const key in row) {
    if (key.startsWith('SCSQ-Q')) {
      combinedSCSQ[key] = (combinedSCSQ[key] || 0) + Number(row[key] || 0);
    }
  }
});

// Initialize an object to store category totals
const categoryTotals = {
  imageryAbility: 0,
  technicalCognition: 0,
  wordForms: 0,
  organisation: 0,
  globalBias: 0,
  systemisingTendency: 0
};

// Calculate category totals based on the combined row
categoryTotals.imageryAbility +=
  combinedSCSQ['SCSQ-Q4'] +
  combinedSCSQ['SCSQ-Q5'] +
  combinedSCSQ['SCSQ-Q7'] +
  combinedSCSQ['SCSQ-Q9'] +
  combinedSCSQ['SCSQ-Q15'] +
  combinedSCSQ['SCSQ-Q18'] +
  combinedSCSQ['SCSQ-Q19'] +
  combinedSCSQ['SCSQ-Q28'] +
  combinedSCSQ['SCSQ-Q33'] +
  combinedSCSQ['SCSQ-Q39'] +
  combinedSCSQ['SCSQ-Q43'] +
  combinedSCSQ['SCSQ-Q47'] +
  combinedSCSQ['SCSQ-Q49'] +
  combinedSCSQ['SCSQ-Q50'] +
  combinedSCSQ['SCSQ-Q56'] +
  combinedSCSQ['SCSQ-Q59'] +
  combinedSCSQ['SCSQ-Q60'];

categoryTotals.technicalCognition +=
  combinedSCSQ['SCSQ-Q2'] +
  combinedSCSQ['SCSQ-Q8'] +
  combinedSCSQ['SCSQ-Q13'] +
  combinedSCSQ['SCSQ-Q14'] +
  combinedSCSQ['SCSQ-Q25'] +
  combinedSCSQ['SCSQ-Q27'] +
  combinedSCSQ['SCSQ-Q30'] +
  combinedSCSQ['SCSQ-Q31'] +
  combinedSCSQ['SCSQ-Q32'] +
  combinedSCSQ['SCSQ-Q34'] +
  combinedSCSQ['SCSQ-Q36'] +
  combinedSCSQ['SCSQ-Q38'] +
  combinedSCSQ['SCSQ-Q42'] +
  combinedSCSQ['SCSQ-Q44'] +
  combinedSCSQ['SCSQ-Q48'] +
  combinedSCSQ['SCSQ-Q53'] +
  combinedSCSQ['SCSQ-Q58'];

categoryTotals.wordForms +=
  combinedSCSQ['SCSQ-Q1'] +
  combinedSCSQ['SCSQ-Q6'] +
  combinedSCSQ['SCSQ-Q26'] +
  combinedSCSQ['SCSQ-Q37'] +
  combinedSCSQ['SCSQ-Q51'] +
  combinedSCSQ['SCSQ-Q54'];

categoryTotals.organisation +=
  combinedSCSQ['SCSQ-Q16'] +
  combinedSCSQ['SCSQ-Q17'] +
  combinedSCSQ['SCSQ-Q29'] +
  combinedSCSQ['SCSQ-Q35'] +
  combinedSCSQ['SCSQ-Q40'] +
  combinedSCSQ['SCSQ-Q57'];

categoryTotals.globalBias +=
  combinedSCSQ['SCSQ-Q11'] +
  combinedSCSQ['SCSQ-Q12'] +
  combinedSCSQ['SCSQ-Q21'] +
  combinedSCSQ['SCSQ-Q22'] +
  combinedSCSQ['SCSQ-Q45'] +
  combinedSCSQ['SCSQ-Q52'] +
  combinedSCSQ['SCSQ-Q55'];

categoryTotals.systemisingTendency +=
  combinedSCSQ['SCSQ-Q3'] +
  combinedSCSQ['SCSQ-Q10'] +
  combinedSCSQ['SCSQ-Q20'] +
  combinedSCSQ['SCSQ-Q23'] +
  combinedSCSQ['SCSQ-Q24'] +
  combinedSCSQ['SCSQ-Q41'] +
  combinedSCSQ['SCSQ-Q46'];

// Store the calculated totals in this.data
this.data = categoryTotals;



}
          },
          "title": "Calculate_SCSQ_Thanks"
        },
        {
          "type": "lab.html.Page",
          "items": [
            {
              "required": true,
              "type": "html",
              "content": "    \u003Cstyle\u003E\r\n        body, html {\r\n            margin: 0;\r\n            padding: 0;\r\n            height: 100%;\r\n            min-height: 100vh;\r\n            font-family: Arial, sans-serif;\r\n        }\r\n\r\n        .header-title {\r\n            margin-top: 20px;\r\n            text-align: center;\r\n        }\r\n\r\n        .labjs-question {\r\n            width: 600px;\r\n            margin: 10px auto;\r\n        }\r\n\r\n        \u002F* Style the anchors to align properly *\u002F\r\n        .labjs-item {\r\n            display: flex;\r\n            justify-content: space-between;\r\n            align-items: center;\r\n            margin-bottom: 20px;\r\n        }\r\n\r\n        .labjs-item label {\r\n            flex: 1;\r\n        }\r\n\r\n        .labjs-item select {\r\n            flex: 0 0 100px; \u002F* Adjust width as needed *\u002F\r\n        }\r\n\r\n        .scale-width {\r\n            display: flex;\r\n            justify-content: space-between;\r\n        }\r\n\r\n        .scale-width div {\r\n            width: calc(100% \u002F 7); \u002F* Adjust based on number of anchors *\u002F\r\n            text-align: center;\r\n        }\r\n    \u003C\u002Fstyle\u003E\r\n\u003C\u002Fhead\u003E\r\n\u003Cbody\u003E\r\n    \u003Cdiv class=\"header-title\"\u003E\r\n            \u003Ch1\u003EMotivation Questionnaire\u003C\u002Fh1\u003E\r\n            \u003Cp\u003ERead each item carefully. Using the scale below, please select the answer that best answers the question: \u003Cbr\u003E\u003Cbr\u003E\u003Cb\u003E Why you are currently engaged in this research?\u003C\u002Fp\u003E\r\n    \u003C\u002Fdiv\u003E\r\n\r\n    \u003Cdiv class=\"labjs-question\"\u003E\r\n        \u003C!-- Lab.js items are dynamically inserted here --\u003E\r\n    \u003C\u002Fdiv\u003E\r\n\u003C\u002Fbody\u003E\r\n\r\n",
              "name": ""
            },
            {
              "required": true,
              "type": "likert",
              "items": [
                {
                  "label": "\u003Cp style=\"width: 300px; text-align: left; font-weight: normal;\"\u003EBecause I think that this activity is interesting \u003C\u002Fp\u003E",
                  "coding": "SMS_Q1"
                },
                {
                  "label": "\u003Cp style=\"text-align: left; font-weight: normal;\"\u003EBecause I am doing it for my own good \u003C\u002Fp\u003E",
                  "coding": "SMS_Q2"
                },
                {
                  "label": "\u003Cp style=\"text-align: left; font-weight: normal;\"\u003EBecause I am supposed to do it \u003C\u002Fp\u003E",
                  "coding": "SMS_Q3"
                },
                {
                  "label": "\u003Cp style=\"text-align: left; font-weight: normal;\"\u003E There may be good reasons to do this activity, but personally I don’t see any \u003C\u002Fp\u003E",
                  "coding": "SMS_Q4"
                },
                {
                  "coding": "SMS_Q5",
                  "label": "\u003Cp style=\"text-align: left; font-weight: normal;\"\u003E  Because I think that this activity is pleasant \u003C\u002Fp\u003E"
                },
                {
                  "coding": "SMS_Q6",
                  "label": "\u003Cp style=\"text-align: left; font-weight: normal;\"\u003E Because I think that this activity is good for me \u003C\u002Fp\u003E"
                },
                {
                  "coding": "SMS_Q7",
                  "label": "\u003Cp style=\"text-align: left; font-weight: normal;\"\u003E Because it is something that I have to do \u003C\u002Fp\u003E"
                },
                {
                  "coding": "SMS_Q8",
                  "label": "\u003Cp style=\"text-align: left; font-weight: normal;\"\u003EI do this activity, but I am not sure if it is worth it \u003C\u002Fp\u003E"
                },
                {
                  "coding": "SMS_Q9",
                  "label": "\u003Cp style=\"text-align: left; font-weight: normal;\"\u003E Because this activity is fun \u003C\u002Fp\u003E"
                },
                {
                  "coding": "SMS_Q10",
                  "label": "\u003Cp style=\"text-align: left; font-weight: normal;\"\u003EBy personal choice \u003C\u002Fp\u003E"
                },
                {
                  "coding": "SMS_Q11",
                  "label": "\u003Cp style=\"text-align: left; font-weight: normal;\"\u003EBecause I don’t have any choice \u003C\u002Fp\u003E"
                },
                {
                  "coding": "SMS_Q12",
                  "label": "\u003Cp style=\"text-align: left; font-weight: normal;\"\u003E I don’t know; I don’t see what this activity brings me \u003C\u002Fp\u003E"
                },
                {
                  "coding": "SMS_Q13",
                  "label": "\u003Cp style=\"text-align: left; font-weight: normal;\"\u003E Because I feel good when doing this activity \u003C\u002Fp\u003E"
                },
                {
                  "coding": "SMS_Q14",
                  "label": "\u003Cp style=\"text-align: left; font-weight: normal;\"\u003EBecause I believe that this activity is important for me \u003C\u002Fp\u003E"
                },
                {
                  "coding": "SMS_Q15",
                  "label": "\u003Cp style=\"text-align: left; font-weight: normal;\"\u003EBecause I feel that I have to do it\u003C\u002Fp\u003E"
                },
                {
                  "label": "\u003Cp style=\"text-align: left; font-weight: normal;\"\u003EI do this activity, but I’m not sure it is a good thing to pursue it \u003C\u002Fp\u003E \u003C\u002Fmain\u003E",
                  "coding": "SMS_Q16"
                }
              ],
              "width": "7",
              "anchors": [
                "Corresponds not at all ",
                "Corresponds a very little",
                "Corresponds a little",
                "Corresponds moderately",
                "Corresponds enough",
                "Corresponds a lot",
                "Corresponds exactly"
              ],
              "label": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E",
              "help": "",
              "name": "SMS",
              "shuffle": false
            }
          ],
          "scrollTop": true,
          "submitButtonText": "Next→",
          "submitButtonPosition": "right",
          "files": {},
          "responses": {},
          "parameters": {},
          "messageHandlers": {
            "end": function anonymous(
) {
//Total IM
this.data.intrinsicMotivation = 
  Number(this.data['SMS-SMS_Q1']) +
  Number(this.data['SMS-SMS_Q5']) +
  Number(this.data['SMS-SMS_Q9']) +
  Number(this.data['SMS-SMS_Q13']) 

//Total IR
this.data.identifiedRegulation = 
  Number(this.data['SMS-SMS_Q2']) +
  Number(this.data['SMS-SMS_Q6']) +
  Number(this.data['SMS-SMS_Q10']) +
  Number(this.data['SMS-SMS_Q14']) 

//Total ER
this.data.externalRegulation = 
  Number(this.data['SMS-SMS_Q3']) +
  Number(this.data['SMS-SMS_Q7']) +
  Number(this.data['SMS-SMS_Q11']) +
  Number(this.data['SMS-SMS_Q15']) 

//Total AM
this.data.amotivation = 
  Number(this.data['SMS-SMS_Q4']) +
  Number(this.data['SMS-SMS_Q8']) +
  Number(this.data['SMS-SMS_Q12']) +
  Number(this.data['SMS-SMS_Q16']) 


//Total SDI
this.data.selfdeterminationIndex = 
  (2 * this.data.intrinsicMotivation) +
  this.data.identifiedRegulation -
  this.data.externalRegulation -
  (2 * this.data.amotivation);

}
          },
          "title": "SMS_Questionnaire_S3",
          "width": "m"
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
                  "content": "\u003Cheader\u003E \u003Ch1\u003E Comments \u003C\u002Fh1\u003E \u003C\u002Fheader\u003E\r\n\u003Cbr\u003E\r\n  \u003Ch3\u003E Would you like to make any final comments before ending the experiment? \u003C\u002Fh3\u003E\r\n\r\n\u003Cform\u003E\r\n\u003Ctextarea name=\"comment_feedback\" id=\"comment\" rows=\"5\" cols=\"60\"\u003E\u003C\u002Ftextarea\u003E\r\n\r\n\u003C\u002Fform\u003E",
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
          "content": "\u003Cheader\u003E\r\n  \u003Ch2\u003E Thank you very much for your participation. The experiment is over. \u003C\u002Fh2\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Ch3 style=\"text-align: center; color: red;\"\u003EPlease click on this link to confirm your participation and return to the Prolific website:\u003C\u002Fh3\u003E\r\n\u003Cp style=\"text-align: center; font-size: 20;\"\u003E\u003Ca href=\"https:\u002F\u002Fapp.prolific.com\u002Fsubmissions\u002Fcomplete?cc=C1O81LSR\"\u003Ehttps:\u002F\u002Fapp.prolific.com\u002Fsubmissions\u002Fcomplete?cc=C1O81LSR\u003C\u002Fa\u003E\u003C\u002Fp\u003E\r\n\r\n\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n  \u003Csection class=\"w-l text-justify\"\u003E\r\n    \u003Cimg src=\"${ this.files[\"Pier_art.jpg\"] }\" width=\"700\"\u003E \u003C\u002Fimg\u003E\r\n    \u003Cfigcaption style=\"font-size:11px\"\u003EM Bleichner: Good Old Brighton Pier\u003C\u002Ffigcaption\u003E\r\n  \u003C\u002Fsection\u003E\r\n\u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n\r\n\u003C\u002Ffooter\u003E",
          "skip": "${this.state.Link_origin != 0}",
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

  // Adding the event handling code
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
          "title": "End_Paypal",
          "content": "  \u003Cheader\u003E\r\n    \u003Ch2\u003EThank you very much for your participation. The experiment is over.\u003C\u002Fh2\u003E\r\n  \u003C\u002Fheader\u003E\r\n\r\n\u003Ch3 style=\"text-align: center; color: red;\"\u003E\r\n  Please enter your email address in the textbox below and click \"Submit\" so we can pay you via Paypal. \u003Cbr\u003EIf you would \u003Cu\u003Enot\u003C\u002Fu\u003E like payment, click the \"Skip\" button.\r\n\u003C\u002Fh3\u003E\r\n\r\n\u003Cdiv id=\"paypalDetailsBox\" style=\"text-align: center; margin-top: 20px;\"\u003E\r\n  \u003Clabel for=\"paypalEmail\" style=\"display: inline-block;\"\u003EPayPal Email:\u003C\u002Flabel\u003E\r\n  \u003Cinput type=\"text\" id=\"paypalEmail\" placeholder=\"Enter your PayPal email\" style=\"display: inline-block;\"\u003E\r\n  \u003Cp style=\"display: inline-block;\"\u003E or \u003C\u002Fp\u003E\r\n  \u003Cbutton id=\"skipButton\" onclick=\"skipPayment()\" style=\"display: inline-block;\"\u003ESkip\u003C\u002Fbutton\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n\u003Cbr\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n  \u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n\u003Cbutton id=\"buttonSubmit\"\u003ESubmit→\u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E\r\n\r\n\r\n\r\n\r\n",
          "skip": "${this.state.Link_origin != 1}",
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
          "content": "\u003Cheader style=\"color: red;\"\u003E\r\n    \u003Ch2\u003EGreat! Your payment response has been recorded.\u003C\u002Fh2\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Cp style=\"text-align: center; margin-left: auto; margin-right: auto; margin-top: 20px;\"\u003E\r\n  \u003Cb\u003E IMPORTANT: \u003C\u002Fb\u003E Congratulations! You have now completed the experiment. If you have selected to be reimbursed for your time via PayPal you should receive payment within the next 10 working days. Please email us if you encounter any issues or have any further questions.\r\n  \u003Cp\u003E\r\n\u003C\u002Fh3\u003E\r\n\r\n \u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n    \u003Csection class=\"w-l text-justify\"\u003E\r\n      \u003Cimg src=\"${this.files[\"Pier_art.jpg\"]}\" width=\"700\" alt=\"Good Old Brighton Pier\"\u003E\r\n      \u003Cfigcaption style=\"font-size: 11px\"\u003EM Bleichner: Good Old Brighton Pier\u003C\u002Ffigcaption\u003E\r\n      \u003Cbr\u003E\r\n      \u003Ch3 style=\"text-align: center;\"\u003E You may now close the browser window. \u003C\u002Fh3\u003E\r\n    \u003C\u002Fsection\u003E\r\n  \u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n\u003Cbutton id=\"buttonSubmit\"\u003EEnd experiment→\u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E\r\n\r\n\r\n\r\n",
          "skip": "${this.state.Link_origin != 1}",
          "tardy": true
        }
      ]
    }
  ]
})

// Let's go!
study.run()
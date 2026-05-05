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
    "title": "Session_1",
    "description": "Footer and motivation formatted.",
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
                  "content": "\u003Cheader\u003E\r\n  \u003Ch1 id=\"welcomeHeader\"\u003ESession 1: Memorising Object Locations and Colours\u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n",
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
              "responses": {
                "click button": "continue"
              },
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
              "submitButtonText": "Next→",
              "submitButtonPosition": "right",
              "files": {},
              "responses": {
                "click button": "continue"
              },
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
                  "content": "\u003Cp\u003E This is an experiment made up of three separate test sessions. This first session will take approximately \u003Cb\u003E 60 minutes \u003C\u002Fb\u003E to complete. Please follow all instructions carefully. \u003C\u002Fp\u003E\n    \n \u003Cp\u003EDuring this study, we ask you to complete a computerised task where you have to memorise the colour and location of objects. We will measure your ability to discriminate between different colours and locations and at the same time we will test your memory for colour and location. The study will take approximately 60 minutes and we can pay you for your time. \u003C\u002Fp\u003E\n\nPlease ensure that you complete this experiment using a \u003Cb\u003E computer. \u003C\u002Fb\u003EIf you are currently using a phone or tablet, close this window and return on a computer. \u003C\u002Fp\u003E \n\n\u003Cb\u003EDuring this task, we ask you to sit in an upright position and have the screen at arm's length at all times. We also advise you to complete this task in fullscreen to mode to ensure it runs properly on your screen. \u003C\u002Fb\u003E\u003C\u002Fp\u003E"
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
              "type": "lab.html.Page",
              "items": [
                {
                  "required": true,
                  "type": "html",
                  "content": "\u003Cheader\u003E \u003Ch1\u003E Participant Code \u003Ch1\u003E \u003C\u002Fheader\u003E\r\n",
                  "name": ""
                },
                {
                  "required": true,
                  "type": "html",
                  "content": " \u003Ctable\u003E\n    \u003Cthead\u003E\n      \u003Ctr\u003E\n        \u003Ctd\u003E\n          \u003Cdiv id=\"pptID\"\u003E\n            \u003Clabel for=\"participant-id\" style=\"height: 40px; font-size: 16px\"\u003E\n              \u003Cb\u003EWe now ask you to generate a code for yourself.\u003C\u002Fb\u003E This code enables us to allocate the experimental conditions. All data is anonymised. We will ask for you to enter this code at the beginning of each session. \u003C\u002Fp\u003E\n              \u003Cp\u003EPlease enter the last letter of your first and last name and the day of the month of your birthday as the code. So, for example, if your name is John Smith and your date of birth is the 1st of March, you would input \u003Cb\u003E NH01 \u003C\u002Fb\u003E:\u003C\u002Fp\u003E\u003Cbr\u003E\n            \u003C\u002Flabel\u003E\n            \u003Cinput type=\"text\" id=\"participant-id\" name=\"participantID\" placeholder=\"ID\" style=\"height: 40px; font-size: 16px\" required pattern=\"[a-zA-Z]{2}((0[1-9])|([12][0-9])|(3[01]))\"\u003E\n          \u003C\u002Fdiv\u003E\n        \u003C\u002Ftd\u003E\n      \u003C\u002Ftr\u003E\n    \u003C\u002Fthead\u003E\n  \u003C\u002Ftable\u003E\n",
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
            }
          ]
        },
        {
          "type": "lab.html.Page",
          "items": [
            {
              "required": true,
              "type": "html",
              "content": "\u003Cheader\u003E\u003Ch1\u003E Great, thank you very much for providing us with that information and for ensuring that all materials are correctly scaled! \u003C\u002Fh1\u003E\u003C\u002Fheader\u003E\r\n\r\n\u003Cp class = \"alert alter-warning\" \u003E We will now introduce you to the task. Please note that this is a difficult experiment. \u003C\u002Fb\u003E Just do your best and take breaks as needed. \u003C\u002Fp\u003E\r\n\r\n\r\n\r\n",
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
          "title": "Practice_Loop",
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
                        "content": "\u003Cheader\u003E\r\n  \u003Ch1 id=\"instructionHeader\"\u003ETask Instructions \u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Cp class = \"alert alter-warning\" \u003E For each object, you will be asked to set the location and the colour that you remember. Please try to do this as accurately as possible.\u003C\u002Fp\u003E\r\n",
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
                    "type": "lab.html.Screen",
                    "files": {
                      "All Lc.mp4": "embedded\u002F973e45de171ef6ef26e325b7d77ae93ba32015880e0a0bc5d28d55b784a95a12.mp4"
                    },
                    "responses": {
                      "click button": "continue"
                    },
                    "parameters": {},
                    "messageHandlers": {
                      "run": function anonymous(
) {
const video = document.getElementById("video");
const nextButton = document.getElementById("next-button");

video.addEventListener("ended", function() {
  nextButton.style.display = "block";
  video.controls = true;
});

video.addEventListener("play", function() {
  video.controls = false;
});

function showNext() {
}

  
}
                    },
                    "title": "Demonstration_Video_LC",
                    "content": "\u003Cbody style=\"display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh;\"\u003E\r\n  \u003Cdiv style=\"text-align: center;\"\u003E\r\n    \u003Cheader\u003E \u003Ch1\u003E Demonstration Video \u003C\u002Fh1\u003E\u003C\u002Fheader\u003E\r\n    \u003Cp class = \"alert alter-warning\" \u003EPlease watch the video below. \u003Cbr\u003EThen press \"Next\" after the video has ended. \u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n  \u003C\u002Fdiv\u003E\r\n  \u003Cdiv style=\"margin-bottom: 20px; display: flex; justify-content: center;\"\u003E\r\n    \u003Cvideo id=\"video\" controls width=\"960\" height=\"540\"\r\n      \u003Csource src=\"${ this.files[\"All Lc.mp4\"] }\" type=\"video\u002Fmp4\"\u003E\r\n    \u003C\u002Fvideo\u003E\r\n  \u003C\u002Fdiv\u003E\r\n  \u003Cdiv style=\"display: flex; justify-content: center;\"\u003E\r\n    \u003Cbutton id=\"next-button\" onclick=\"showNext()\"\u003ENext→\u003C\u002Fbutton\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fbody\u003E\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n",
                    "skip": "${this.state.counterbalancing != 1}"
                  },
                  {
                    "type": "lab.html.Page",
                    "items": [
                      {
                        "required": true,
                        "type": "html",
                        "content": "\u003Cheader\u003E\r\n  \u003Ch1 id=\"instructionHeader\"\u003ETask Instructions \u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Cp class = \"alert alter-warning\" \u003E For each object, you will be asked to set the location and the colour that you remember. Please try to do this as accurately as possible.\u003C\u002Fp\u003E\r\n",
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
                  },
                  {
                    "type": "lab.html.Screen",
                    "files": {
                      "All Cl.mp4": "embedded\u002F29cca71a147ecaa43e3993e303658904501f78d9115302399361ceae7ae72d37.mp4"
                    },
                    "responses": {
                      "click button": "continue"
                    },
                    "parameters": {},
                    "messageHandlers": {
                      "run": function anonymous(
) {
const video = document.getElementById("video");
const nextButton = document.getElementById("next-button");

video.addEventListener("ended", function() {
  nextButton.style.display = "block";
  video.controls = true;
});

video.addEventListener("play", function() {
  video.controls = false;
});

function showNext() {
}
}
                    },
                    "title": "Demonstration_Video_CL",
                    "content": "\u003Cbody style=\"display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh;\"\u003E\r\n  \u003Cdiv style=\"text-align: center;\"\u003E\r\n    \u003Cheader\u003E \u003Ch1\u003E Demonstration Video \u003C\u002Fh1\u003E\u003C\u002Fheader\u003E\r\n    \u003Cp class = \"alert alter-warning\" \u003EPlease watch the video below. \u003Cbr\u003EThen press \"Next\" after the video has ended. \u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n  \u003C\u002Fdiv\u003E\r\n  \u003Cdiv style=\"margin-bottom: 20px; display: flex; justify-content: center;\"\u003E\r\n    \u003Cvideo id=\"video\" controls width=\"960\" height=\"540\"\r\n      \u003Csource src=\"${ this.files[\"All Cl.mp4\"] }\" type=\"video\u002Fmp4\"\u003E\r\n    \u003C\u002Fvideo\u003E\r\n  \u003C\u002Fdiv\u003E\r\n  \u003Cdiv style=\"display: flex; justify-content: center;\"\u003E\r\n    \u003Cbutton id=\"next-button\" onclick=\"showNext()\"\u003ENext→\u003C\u002Fbutton\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fbody\u003E\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n",
                    "skip": "${this.state.counterbalancing != 2}"
                  }
                ]
              },
              {
                "type": "lab.html.Page",
                "items": [
                  {
                    "required": true,
                    "type": "html",
                    "content": "\u003Cheader\u003E\r\n  \u003Ch1 id=\"instructionHeader\"\u003ENow it's your turn to have a go! \u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E\r\n\u003Cp style=\"font-size: 24px; position: center\"\u003E You are about to begin the practice section. There are four objects to look at and remember as precisely as possible here. Don't worry if you don't get everything right! It's a challenging task and these answers will not count towards your overall accuracy scores. \u003C\u002Fp\u003E\r\n\u003Cp style=\"font-size: 24px; position: center\"\u003E Click \"Start\" to begin. \u003C\u002Fp\u003E",
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
                "title": "PracticeIntro_Screen",
                "width": "l"
              },
              {
                "type": "lab.flow.Loop",
                "templateParameters": [
                  {
                    "image": "image_1.png",
                    "hue": "0",
                    "theta": "0"
                  },
                  {
                    "image": "image_2.png",
                    "hue": "90",
                    "theta": "90"
                  },
                  {
                    "image": "image_3.png",
                    "hue": "180",
                    "theta": "180"
                  },
                  {
                    "image": "image_4.png",
                    "hue": "270",
                    "theta": "270"
                  }
                ],
                "sample": {
                  "mode": "sequential"
                },
                "files": {},
                "responses": {},
                "parameters": {},
                "messageHandlers": {},
                "title": "Encoding_Loop",
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
var thetaR = this.parameters.theta * Math.PI/180

// calculate x and y coordinates. coordinates are shifted in relation to center of the viewbox / circle and correspondint to center of the image
var xPos = (this.state.radius * Math.cos(thetaR)) + this.state.imgShift 
var yPos = (this.state.radius * Math.sin(thetaR)) + this.state.imgShift

// save coordinates
this.options.datastore.set('imgPosX', xPos)
this.options.datastore.set('imgPosY', yPos)

// send it to html object to present
document.getElementById('image').style.left = xPos  + "px"
document.getElementById('image').style.top  = yPos  + "px"
}
                      },
                      "title": "Encoding_Screen",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n\r\n  \u003Cdiv class = \"pickparent\" style= \"\"\u003E\r\n     \u003Csvg class=\"pickpicker\"\r\n          height =\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" \r\n          viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\r\n          \u003C!–– keep scaling similar for object with: preserveAspectRatio =\"xMinYMin meet\", put it back bfore viewbox if needed --\u003E\r\n       \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\r\n          style=\"fill: #f2f2f2\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \r\n          style=\"fill: white\"\r\n        \u002F\u003E\r\n      \u003C\u002Fsvg\u003E\r\n\r\n      \u003Cimg id=\"image\" class='pickimage' src=\"static\u002F${this.parameters.image}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue}deg)'\u003E\r\n\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E\r\n\r\n    \u003Cfooter\u003E\r\n  \u003Cp id=\"fwd\"\u003E\r\n \r\n  \u003C\u002Fp\u003E\r\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\r\n    I'm just here for similar footer\r\n\u003Cbr\u003E\r\n\u003Cbr\u003E\r\n\u003Cbr\u003E\r\n  \u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E\r\n\r\n\r\n\r\n",
                      "tardy": true,
                      "timeout": "2000"
                    }
                  ]
                }
              },
              {
                "type": "lab.flow.Loop",
                "templateParameters": [
                  {
                    "image": "image_1.png",
                    "hue": "0",
                    "theta": "0"
                  },
                  {
                    "image": "image_2.png",
                    "hue": "90",
                    "theta": "90"
                  },
                  {
                    "image": "image_3.png",
                    "hue": "180",
                    "theta": "180"
                  },
                  {
                    "image": "image_4.png",
                    "hue": "270",
                    "theta": "270"
                  }
                ],
                "sample": {
                  "mode": "sequential"
                },
                "files": {},
                "responses": {},
                "parameters": {},
                "messageHandlers": {},
                "title": "Recall_Loop",
                "shuffleGroups": [],
                "template": {
                  "type": "lab.flow.Sequence",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Recall_Sequence",
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
                      "title": "Location_Recall",
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
                      "title": "Colour_Recall",
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
                      "title": "Location_Recall",
                      "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\n\n    \u003Cdiv class = \"pickparent\" style= \"\"\u003E\n         \u003Csvg class='pickpicker' height=\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\n        \n          \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\n          style=\"fill: #f2f2f2\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \n          style=\"fill: white\"\n        \u002F\u003E\n      \u003C\u002Fsvg\u003E\n    \n     \u003Cimg class='pickimage'id=\"previewL\" src=\"static\u002F${this.parameters.image}\"      \n       style = 'height: ${this.state.imgHeight + \"px\"}; pointer-events: none;'\u003E\n\n\n    \u003C\u002Fdiv\u003E\n\n\u003C\u002Fmain\u003E\n\n\u003Cfooter\u003E\n  \u003Cp id=\"fwd\"\u003E\n  Keep left mouse button pressed and move object to set LOCATION on circle.\n  \u003C\u002Fp\u003E\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\n    Confirm selected LOCATION and continue\n  \u003C\u002Fbutton\u003E\n\u003C\u002Ffooter\u003E",
                      "tardy": true,
                      "skip": "${this.state.counterbalancing != 2}"
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

// Get the participant's performance values
//const locationValue = this.state.location_angle_abs_deviation;
//const colorValue = this.state.color_angle_abs_deviation;

const locationValue = Math.sqrt(this.state.location_angle_abs_deviation);
const colorValue = Math.sqrt(this.state.color_angle_abs_deviation);

// Calculate the position of the circle indicators
//const locationIndicatorPosition = (locationValue / 179) * 100;
//const colorIndicatorPosition = (colorValue / 179) * 100;

const locationIndicatorPosition = (locationValue / Math.sqrt(180)) * 100;
const colorIndicatorPosition = (colorValue / Math.sqrt(180)) * 100;

// Set the position of the circle indicators
locationIndicator.style.left = `${locationIndicatorPosition}%`;
colorIndicator.style.left = `${colorIndicatorPosition}%`;

skillsContainer1.style.transform = "scale("+window.scaling_rectx*0.004+")";
skillsContainer2.style.transform = "scale("+window.scaling_rectx*0.004+")";


}
                      },
                      "title": "Single_Trial_Feedback",
                      "content": " \u003Cdiv class=\"centered-container\"\u003E\r\n \u003Cdiv class=\"block-feedback\"\u003E\r\n    \u003Ch1 style=\"text-align: center; font-size: 28px;\"\u003E Feedback \u003C\u002Fh1\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\r\n  \u003Cdiv class=\"skills-container\" id=\"skillsContainer1\"\u003E\r\n    \u003Cp style = \"font-size: 28px\" id=\"fontLocation\"\u003ELocation:\u003C\u002Fp\u003E\r\n    \u003Cdiv class=\"skills-bar\"\u003E\r\n      \u003Cdiv class=\"skills-range\"\u003E\u003C\u002Fdiv\u003E\r\n      \u003Cdiv class=\"indicator-circle\" id=\"locationIndicator\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n    \u003Cp class=\"skills-label\" style=\"font-size:50px; color: green; font-weight: bold;\"\u003E&#x2713\u003C\u002Fp\u003E\r\n    \u003Cp class=\"skills-max-label\" style=\"font-size:50px; color: red; font-weight: bold;\"\u003E&#x2717\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\r\n  \u003Cdiv class=\"skills-container\" id=\"skillsContainer2\"\u003E\r\n    \u003Cp style = \"font-size: 28px\"\u003EColour:\u003C\u002Fp\u003E\r\n    \u003Cdiv class=\"skills-bar\"\u003E\r\n      \u003Cdiv class=\"skills-range\"\u003E\u003C\u002Fdiv\u003E\r\n      \u003Cdiv class=\"indicator-circle\" id=\"colorIndicator\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n    \u003Cp class=\"skills-label\" style=\"font-size:50px; color: green; font-weight: bold;\"\u003E&#x2713\u003C\u002Fp\u003E\r\n    \u003Cp class=\"skills-max-label\" style=\"font-size:50px; color: red; font-weight: bold;\"\u003E&#x2717\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n\r\n\u003Cbutton id=\"buttonSubmit\" style=\"position: absolute; bottom: 4.5%; right: 2.5%;\"\u003ENext→\u003C\u002Fbutton\u003E\r\n"
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
  row => row.sender === 'Location_Recall' && row.ended_on !== 'skipped' && row.block === this.parameters.block && row.repetition === this.parameters.repetition
);

// filter by Colour_Recall
const color_filtered_data = this.options.datastore.data.filter(
  row => row.sender === 'Colour_Recall' && row.ended_on !== 'skipped' && row.block === this.parameters.block && row.repetition === this.parameters.repetition
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
                "content": " \u003Cdiv class=\"centered-container\"\u003E\r\n \u003Cdiv class=\"block-feedback\"\u003E\r\n    \u003Ch1 style=\"text-align: center; font-size: 28px;\"\u003EBlock Feedback\u003C\u002Fh1\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\r\n  \u003Cdiv class=\"skills-container\" id=\"skillsContainer1\"\u003E\r\n    \u003Cp style = \"font-size: 28px\" id=\"fontLocation\"\u003ELocation:\u003C\u002Fp\u003E\r\n    \u003Cdiv class=\"skills-bar\"\u003E\r\n      \u003Cdiv class=\"skills-range\"\u003E\u003C\u002Fdiv\u003E\r\n      \u003Cdiv class=\"indicator-circle\" id=\"locationIndicator\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n    \u003Cp class=\"skills-label\" style=\"font-size:50px; color: green; font-weight: bold;\"\u003E&#x2713\u003C\u002Fp\u003E\r\n    \u003Cp class=\"skills-max-label\" style=\"font-size:50px; color: red; font-weight: bold;\"\u003E&#x2717\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\r\n  \u003Cdiv class=\"skills-container\" id=\"skillsContainer2\"\u003E\r\n    \u003Cp style = \"font-size: 28px\"\u003EColour:\u003C\u002Fp\u003E\r\n    \u003Cdiv class=\"skills-bar\"\u003E\r\n      \u003Cdiv class=\"skills-range\"\u003E\u003C\u002Fdiv\u003E\r\n      \u003Cdiv class=\"indicator-circle\" id=\"colorIndicator\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n    \u003Cp class=\"skills-label\" style=\"font-size:50px; color: green; font-weight: bold;\"\u003E&#x2713\u003C\u002Fp\u003E\r\n    \u003Cp class=\"skills-max-label\" style=\"font-size:50px; color: red; font-weight: bold;\"\u003E&#x2717\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n\u003Cfooter style=\"position: absolute; width: calc(100% - 2.4%); bottom: 1.2%; left: 1.2%; right: 1.2%; text-align: center;\"\u003E\r\n    \u003Cbutton id=\"buttonSubmit\"\u003ENext→\u003C\u002Fbutton\u003E\r\n  \u003C\u002Ffooter\u003E\r\n\r\n",
                "tardy": true
              },
              {
                "type": "lab.html.Page",
                "items": [
                  {
                    "required": true,
                    "type": "html",
                    "content": "\u003Cheader\u003E\r\n  \u003Ch1\u003EWell done!\u003C\u002Fh1\u003E\r\n\r\n\u003Ch2\u003E Now it's time to give the full task a go. \u003C\u002Fh2\u003E \u003C\u002Fheader\u003E\r\n\u003Ch3\u003E How is the full task different? \u003C\u002Fh3\u003E\r\n\r\n\u003Cp\u003E It works the same way as the practice section, but it is longer. \u003C\u002Fp\u003E \r\n\r\n\u003Cp\u003EYou will be presented with groups of \u003Cb\u003E fifteen objects \u003C\u002Fb\u003E in a certain location and colour one after the other. After viewing all fifteen objects in a row, you will then be shown them again in grey one at a time. Your task is to set the location and colour for each object as you remember them. \u003C\u002Fp\u003E\r\n\r\n\u003Cp\u003EThere are \u003Cb\u003E three groups \u003C\u002Fb\u003E of fifteen objects for you to memorise in total. Each group will be displayed and prompted for recall \u003Cb\u003E four times \u003C\u002Fb\u003E. \r\n\r\n\u003Cp\u003EYou will receive feedback on your performance throughout the experiment. Remember, this is meant to be a difficult task so don't be too hard on yourself if youo can't remember everything exactly! \u003C\u002Fp\u003E\r\n\r\n\r\n\r\n",
                    "name": ""
                  },
                  {
                    "required": true,
                    "type": "divider"
                  },
                  {
                    "required": true,
                    "type": "html",
                    "content": "\u003Cp\u003E You are about to begin the test blocks. Click \"Start\" to begin. \u003C\u002Fp\u003E",
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
                "title": "Congrats_Screen",
                "width": "l"
              }
            ]
          }
        },
        {
          "type": "lab.html.Page",
          "items": [
            {
              "required": true,
              "type": "html",
              "content": "\u003Cheader\u003E\r\n  \u003Ch1 id=\"instructionHeader\"\u003ETest Blocks\u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E\r\n\u003Cp style=\"font-size: 24px; position: center\"\u003E You are about to begin the test blocks. Click \"Start\" to begin. \u003C\u002Fp\u003E",
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
              "block": 1
            },
            {
              "block": 2
            },
            {
              "block": 3
            }
          ],
          "sample": {
            "mode": "draw-shuffle",
            "n": ""
          },
          "files": {},
          "responses": {},
          "parameters": {},
          "messageHandlers": {
            "before:prepare": function anonymous(
) {
this.parameters.practice = "no"
}
          },
          "title": "Block_Loop",
          "tardy": true,
          "indexParameter": "set_counter",
          "shuffleGroups": [
            [
              "block"
            ]
          ],
          "template": {
            "type": "lab.flow.Loop",
            "templateParameters": [
              {
                "repetition": 1
              },
              {
                "repetition": 2
              },
              {
                "repetition": 3
              },
              {
                "repetition": 4
              }
            ],
            "sample": {
              "mode": "sequential",
              "n": ""
            },
            "files": {},
            "responses": {},
            "parameters": {},
            "messageHandlers": {},
            "title": "Repetition_Loop",
            "tardy": true,
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
this.state.imgHeight =  window.scaling_rectx * 0.6 // we present image squared, so this is enough
// this.state.imgWidth = 180

// shift the image position by this value (so it is relative to the center of the circles)
this.state.imgShift = this.state.radius - this.state.imgHeight/2


}
              },
              "title": "Task_Sequence",
              "content": [
                {
                  "type": "lab.flow.Loop",
                  "templateParameters": [
                    {
                      "block_n": "1",
                      "hue_n": "1",
                      "hue": "1",
                      "theta_n": "3",
                      "theta": "15",
                      "image": "image_5.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "2",
                      "hue": "22",
                      "theta_n": "9",
                      "theta": "197",
                      "image": "image_6.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "3",
                      "hue": "52",
                      "theta_n": "13",
                      "theta": "291",
                      "image": "image_7.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "4",
                      "hue": "73",
                      "theta_n": "7",
                      "theta": "149",
                      "image": "image_8.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "5",
                      "hue": "100",
                      "theta_n": "6",
                      "theta": "121",
                      "image": "image_9.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "6",
                      "hue": "119",
                      "theta_n": "1",
                      "theta": "5",
                      "image": "image_10.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "7",
                      "hue": "141",
                      "theta_n": "4",
                      "theta": "73",
                      "image": "image_11.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "8",
                      "hue": "169",
                      "theta_n": "2",
                      "theta": "29",
                      "image": "image_12.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "9",
                      "hue": "194",
                      "theta_n": "12",
                      "theta": "265",
                      "image": "image_13.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "10",
                      "hue": "216",
                      "theta_n": "10",
                      "theta": "215",
                      "image": "image_14.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "11",
                      "hue": "244",
                      "theta_n": "14",
                      "theta": "311",
                      "image": "image_15.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "12",
                      "hue": "265",
                      "theta_n": "8",
                      "theta": "170",
                      "image": "image_16.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "13",
                      "hue": "285",
                      "theta_n": "15",
                      "theta": "340",
                      "image": "image_17.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "14",
                      "hue": "311",
                      "theta_n": "11",
                      "theta": "244",
                      "image": "image_18.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "15",
                      "hue": "341",
                      "theta_n": "5",
                      "theta": "95",
                      "image": "image_19.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "1",
                      "hue": "15",
                      "theta_n": "5",
                      "theta": "110",
                      "image": "image_20.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "2",
                      "hue": "45",
                      "theta_n": "2",
                      "theta": "37",
                      "image": "image_21.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "3",
                      "hue": "68",
                      "theta_n": "11",
                      "theta": "258",
                      "image": "image_22.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "4",
                      "hue": "91",
                      "theta_n": "1",
                      "theta": "13",
                      "image": "image_23.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "5",
                      "hue": "113",
                      "theta_n": "10",
                      "theta": "237",
                      "image": "image_24.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "6",
                      "hue": "141",
                      "theta_n": "4",
                      "theta": "87",
                      "image": "image_25.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "7",
                      "hue": "158",
                      "theta_n": "9",
                      "theta": "211",
                      "image": "image_26.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "8",
                      "hue": "185",
                      "theta_n": "7",
                      "theta": "164",
                      "image": "image_27.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "9",
                      "hue": "207",
                      "theta_n": "15",
                      "theta": "351",
                      "image": "image_28.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "10",
                      "hue": "234",
                      "theta_n": "3",
                      "theta": "63",
                      "image": "image_29.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "11",
                      "hue": "257",
                      "theta_n": "12",
                      "theta": "278",
                      "image": "image_30.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "12",
                      "hue": "282",
                      "theta_n": "14",
                      "theta": "330",
                      "image": "image_31.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "13",
                      "hue": "308",
                      "theta_n": "13",
                      "theta": "301",
                      "image": "image_32.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "14",
                      "hue": "333",
                      "theta_n": "6",
                      "theta": "133",
                      "image": "image_33.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "15",
                      "hue": "351",
                      "theta_n": "8",
                      "theta": "188",
                      "image": "image_34.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "1",
                      "hue": "5",
                      "theta_n": "10",
                      "theta": "227",
                      "image": "image_35.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "2",
                      "hue": "37",
                      "theta_n": "13",
                      "theta": "300",
                      "image": "image_36.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "3",
                      "hue": "59",
                      "theta_n": "12",
                      "theta": "270",
                      "image": "image_37.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "4",
                      "hue": "81",
                      "theta_n": "15",
                      "theta": "345",
                      "image": "image_38.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "5",
                      "hue": "104",
                      "theta_n": "6",
                      "theta": "127",
                      "image": "image_39.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "6",
                      "hue": "126",
                      "theta_n": "8",
                      "theta": "176",
                      "image": "image_40.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "7",
                      "hue": "156",
                      "theta_n": "5",
                      "theta": "105",
                      "image": "image_41.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "8",
                      "hue": "174",
                      "theta_n": "14",
                      "theta": "324",
                      "image": "image_42.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "9",
                      "hue": "198",
                      "theta_n": "2",
                      "theta": "29",
                      "image": "image_43.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "10",
                      "hue": "223",
                      "theta_n": "9",
                      "theta": "200",
                      "image": "image_44.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "11",
                      "hue": "249",
                      "theta_n": "7",
                      "theta": "157",
                      "image": "image_45.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "12",
                      "hue": "269",
                      "theta_n": "4",
                      "theta": "82",
                      "image": "image_46.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "13",
                      "hue": "293",
                      "theta_n": "3",
                      "theta": "55",
                      "image": "image_47.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "14",
                      "hue": "319",
                      "theta_n": "1",
                      "theta": "13",
                      "image": "image_48.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "15",
                      "hue": "344",
                      "theta_n": "11",
                      "theta": "252",
                      "image": "image_49.png"
                    }
                  ],
                  "sample": {
                    "mode": "draw-shuffle",
                    "n": ""
                  },
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {
                    "before:prepare": function anonymous(
) {
this.options.templateParameters = this.options.templateParameters.filter(row => row.block_n == this.parameters.block)
}
                  },
                  "title": "Encoding_Loop",
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
var thetaR = this.parameters.theta * Math.PI/180

// calculate x and y coordinates. coordinates are shifted in relation to center of the viewbox / circle and correspondint to center of the image
var xPos = (this.state.radius * Math.cos(thetaR)) + this.state.imgShift 
var yPos = (this.state.radius * Math.sin(thetaR)) + this.state.imgShift

// save coordinates
this.options.datastore.set('imgPosX', xPos)
this.options.datastore.set('imgPosY', yPos)

// send it to html object to present
document.getElementById('image').style.left = xPos  + "px"
document.getElementById('image').style.top  = yPos  + "px"
}
                        },
                        "title": "Encoding_Screen",
                        "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\r\n\r\n  \u003Cdiv class = \"pickparent\" style= \"\"\u003E\r\n     \u003Csvg class=\"pickpicker\"\r\n          height =\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" \r\n          viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\r\n          \u003C!–– keep scaling similar for object with: preserveAspectRatio =\"xMinYMin meet\", put it back bfore viewbox if needed --\u003E\r\n       \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\r\n          style=\"fill: #f2f2f2\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \r\n          style=\"fill: black\"\r\n        \u002F\u003E\r\n        \u003Ccircle\r\n          id=\"colorCircle\"\r\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \r\n          style=\"fill: white\"\r\n        \u002F\u003E\r\n      \u003C\u002Fsvg\u003E\r\n\r\n      \u003Cimg id=\"image\" class='pickimage' src=\"static\u002F${this.parameters.image}\"    \r\n       style = 'position: absolute;z-index: 2;height: ${this.state.imgHeight + \"px\"}; pointer-events: none; filter: hue-rotate(${this.parameters.hue}deg)'\u003E\r\n\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E\r\n\r\n  \u003Cfooter\u003E\r\n  \u003Cp id=\"fwd\"\u003E\r\n \r\n  \u003C\u002Fp\u003E\r\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\r\n    I'm just here for similar footer\r\n\u003Cbr\u003E\r\n\u003Cbr\u003E\r\n\u003Cbr\u003E\r\n  \u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E\r\n\r\n\r\n\r\n",
                        "tardy": true,
                        "timeout": "2000"
                      }
                    ]
                  }
                },
                {
                  "type": "lab.html.Screen",
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {},
                  "title": "Retention",
                  "timeout": "1000"
                },
                {
                  "type": "lab.flow.Loop",
                  "templateParameters": [
                    {
                      "block_n": "1",
                      "hue_n": "1",
                      "hue": "1",
                      "theta_n": "3",
                      "theta": "15",
                      "image": "image_5.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "2",
                      "hue": "22",
                      "theta_n": "9",
                      "theta": "197",
                      "image": "image_6.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "3",
                      "hue": "52",
                      "theta_n": "13",
                      "theta": "291",
                      "image": "image_7.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "4",
                      "hue": "73",
                      "theta_n": "7",
                      "theta": "149",
                      "image": "image_8.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "5",
                      "hue": "100",
                      "theta_n": "6",
                      "theta": "121",
                      "image": "image_9.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "6",
                      "hue": "119",
                      "theta_n": "1",
                      "theta": "5",
                      "image": "image_10.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "7",
                      "hue": "141",
                      "theta_n": "4",
                      "theta": "73",
                      "image": "image_11.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "8",
                      "hue": "169",
                      "theta_n": "2",
                      "theta": "29",
                      "image": "image_12.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "9",
                      "hue": "194",
                      "theta_n": "12",
                      "theta": "265",
                      "image": "image_13.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "10",
                      "hue": "216",
                      "theta_n": "10",
                      "theta": "215",
                      "image": "image_14.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "11",
                      "hue": "244",
                      "theta_n": "14",
                      "theta": "311",
                      "image": "image_15.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "12",
                      "hue": "265",
                      "theta_n": "8",
                      "theta": "170",
                      "image": "image_16.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "13",
                      "hue": "285",
                      "theta_n": "15",
                      "theta": "340",
                      "image": "image_17.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "14",
                      "hue": "311",
                      "theta_n": "11",
                      "theta": "244",
                      "image": "image_18.png"
                    },
                    {
                      "block_n": "1",
                      "hue_n": "15",
                      "hue": "341",
                      "theta_n": "5",
                      "theta": "95",
                      "image": "image_19.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "1",
                      "hue": "15",
                      "theta_n": "5",
                      "theta": "110",
                      "image": "image_20.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "2",
                      "hue": "45",
                      "theta_n": "2",
                      "theta": "37",
                      "image": "image_21.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "3",
                      "hue": "68",
                      "theta_n": "11",
                      "theta": "258",
                      "image": "image_22.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "4",
                      "hue": "91",
                      "theta_n": "1",
                      "theta": "13",
                      "image": "image_23.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "5",
                      "hue": "113",
                      "theta_n": "10",
                      "theta": "237",
                      "image": "image_24.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "6",
                      "hue": "141",
                      "theta_n": "4",
                      "theta": "87",
                      "image": "image_25.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "7",
                      "hue": "158",
                      "theta_n": "9",
                      "theta": "211",
                      "image": "image_26.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "8",
                      "hue": "185",
                      "theta_n": "7",
                      "theta": "164",
                      "image": "image_27.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "9",
                      "hue": "207",
                      "theta_n": "15",
                      "theta": "351",
                      "image": "image_28.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "10",
                      "hue": "234",
                      "theta_n": "3",
                      "theta": "63",
                      "image": "image_29.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "11",
                      "hue": "257",
                      "theta_n": "12",
                      "theta": "278",
                      "image": "image_30.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "12",
                      "hue": "282",
                      "theta_n": "14",
                      "theta": "330",
                      "image": "image_31.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "13",
                      "hue": "308",
                      "theta_n": "13",
                      "theta": "301",
                      "image": "image_32.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "14",
                      "hue": "333",
                      "theta_n": "6",
                      "theta": "133",
                      "image": "image_33.png"
                    },
                    {
                      "block_n": "2",
                      "hue_n": "15",
                      "hue": "351",
                      "theta_n": "8",
                      "theta": "188",
                      "image": "image_34.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "1",
                      "hue": "5",
                      "theta_n": "10",
                      "theta": "227",
                      "image": "image_35.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "2",
                      "hue": "37",
                      "theta_n": "13",
                      "theta": "300",
                      "image": "image_36.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "3",
                      "hue": "59",
                      "theta_n": "12",
                      "theta": "270",
                      "image": "image_37.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "4",
                      "hue": "81",
                      "theta_n": "15",
                      "theta": "345",
                      "image": "image_38.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "5",
                      "hue": "104",
                      "theta_n": "6",
                      "theta": "127",
                      "image": "image_39.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "6",
                      "hue": "126",
                      "theta_n": "8",
                      "theta": "176",
                      "image": "image_40.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "7",
                      "hue": "156",
                      "theta_n": "5",
                      "theta": "105",
                      "image": "image_41.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "8",
                      "hue": "174",
                      "theta_n": "14",
                      "theta": "324",
                      "image": "image_42.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "9",
                      "hue": "198",
                      "theta_n": "2",
                      "theta": "29",
                      "image": "image_43.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "10",
                      "hue": "223",
                      "theta_n": "9",
                      "theta": "200",
                      "image": "image_44.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "11",
                      "hue": "249",
                      "theta_n": "7",
                      "theta": "157",
                      "image": "image_45.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "12",
                      "hue": "269",
                      "theta_n": "4",
                      "theta": "82",
                      "image": "image_46.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "13",
                      "hue": "293",
                      "theta_n": "3",
                      "theta": "55",
                      "image": "image_47.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "14",
                      "hue": "319",
                      "theta_n": "1",
                      "theta": "13",
                      "image": "image_48.png"
                    },
                    {
                      "block_n": "3",
                      "hue_n": "15",
                      "hue": "344",
                      "theta_n": "11",
                      "theta": "252",
                      "image": "image_49.png"
                    }
                  ],
                  "sample": {
                    "mode": "draw-shuffle",
                    "n": ""
                  },
                  "files": {},
                  "responses": {},
                  "parameters": {},
                  "messageHandlers": {
                    "before:prepare": function anonymous(
) {
this.options.templateParameters = this.options.templateParameters.filter(row => row.block_n == this.parameters.block)
}
                  },
                  "title": "Recall_Loop",
                  "shuffleGroups": [],
                  "template": {
                    "type": "lab.flow.Sequence",
                    "files": {},
                    "responses": {},
                    "parameters": {},
                    "messageHandlers": {},
                    "title": "Recall_Sequence",
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
                        "title": "Location_Recall_LTMI",
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
                        "title": "Colour_Recall_LTMI",
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
                        "title": "Location_Recall_LTMI",
                        "content": "\u003Cmain class=\"content-vertical-center content-horizontal-center\"\u003E\n\n    \u003Cdiv class = \"pickparent\" style= \"\"\u003E\n         \u003Csvg class='pickpicker' height=\"${ this.state.diameter }\" width=\"${ this.state.diameter }\" viewbox=\"0 0 ${ this.state.diameter } ${ this.state.diameter }\"\u003E\n        \n          \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius }\"\n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius1 }\"\n          style=\"fill: #f2f2f2\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius2 }\" \n          style=\"fill: black\"\n        \u002F\u003E\n        \u003Ccircle\n          id=\"locationCircle\"\n          cx=\"${ this.state.radius }\" cy=\"${ this.state.radius }\" r=\"${ this.state.radius3 }\" \n          style=\"fill: white\"\n        \u002F\u003E\n      \u003C\u002Fsvg\u003E\n    \n     \u003Cimg class='pickimage'id=\"previewL\" src=\"static\u002F${this.parameters.image}\"      \n       style = 'height: ${this.state.imgHeight + \"px\"}; pointer-events: none;'\u003E\n\n\n    \u003C\u002Fdiv\u003E\n\n\u003C\u002Fmain\u003E\n\n\u003Cfooter\u003E\n  \u003Cp id=\"fwd\"\u003E\n  Keep left mouse button pressed and move object to set LOCATION on circle.\n  \u003C\u002Fp\u003E\n  \u003Cbutton id=\"cmt\" style=\"visibility: hidden\"\u003E\n    Confirm selected LOCATION and continue\n  \u003C\u002Fbutton\u003E\n\u003C\u002Ffooter\u003E",
                        "tardy": true,
                        "skip": "${this.state.counterbalancing != 2}"
                      },
                      {
                        "type": "lab.html.Screen",
                        "files": {},
                        "responses": {},
                        "parameters": {},
                        "messageHandlers": {
                          "run": function anonymous(
) {
// Get the circle indicator elements
const locationIndicator = document.getElementById('locationIndicator');
const colorIndicator = document.getElementById('colorIndicator');

// Get the participant's performance values
//const locationValue = this.state.location_angle_abs_deviation;
//const colorValue = this.state.color_angle_abs_deviation;

const locationValue = Math.sqrt(this.state.location_angle_abs_deviation);
const colorValue = Math.sqrt(this.state.color_angle_abs_deviation);

// Calculate the position of the circle indicators
//const locationIndicatorPosition = (locationValue / 179) * 100;
//const colorIndicatorPosition = (colorValue / 179) * 100;

const locationIndicatorPosition = (locationValue / Math.sqrt(180)) * 100;
const colorIndicatorPosition = (colorValue / Math.sqrt(180)) * 100;

// Set the position of the circle indicators
locationIndicator.style.left = `${locationIndicatorPosition}%`;
colorIndicator.style.left = `${colorIndicatorPosition}%`;

skillsContainer1.style.transform = "scale("+window.scaling_rectx*0.004+")";
skillsContainer2.style.transform = "scale("+window.scaling_rectx*0.004+")";


}
                        },
                        "title": "Single_Trial_Feedback",
                        "timeout": "2000",
                        "content": " \u003Cdiv class=\"centered-container\"\u003E\r\n \u003Cdiv class=\"block-feedback\"\u003E\r\n    \u003Ch1 style=\"text-align: center; font-size: 28px;\"\u003E Feedback \u003C\u002Fh1\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\r\n  \u003Cdiv class=\"skills-container\" id=\"skillsContainer1\"\u003E\r\n    \u003Cp style = \"font-size: 28px\" id=\"fontLocation\"\u003ELocation:\u003C\u002Fp\u003E\r\n    \u003Cdiv class=\"skills-bar\"\u003E\r\n      \u003Cdiv class=\"skills-range\"\u003E\u003C\u002Fdiv\u003E\r\n      \u003Cdiv class=\"indicator-circle\" id=\"locationIndicator\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n    \u003Cp class=\"skills-label\" style=\"font-size:50px; color: green; font-weight: bold;\"\u003E&#x2713\u003C\u002Fp\u003E\r\n    \u003Cp class=\"skills-max-label\" style=\"font-size:50px; color: red; font-weight: bold;\"\u003E&#x2717\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\r\n  \u003Cdiv class=\"skills-container\" id=\"skillsContainer2\"\u003E\r\n    \u003Cp style = \"font-size: 28px\"\u003EColour:\u003C\u002Fp\u003E\r\n    \u003Cdiv class=\"skills-bar\"\u003E\r\n      \u003Cdiv class=\"skills-range\"\u003E\u003C\u002Fdiv\u003E\r\n      \u003Cdiv class=\"indicator-circle\" id=\"colorIndicator\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n    \u003Cp class=\"skills-label\" style=\"font-size:50px; color: green; font-weight: bold;\"\u003E&#x2713\u003C\u002Fp\u003E\r\n    \u003Cp class=\"skills-max-label\" style=\"font-size:50px; color: red; font-weight: bold;\"\u003E&#x2717\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n"
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
  row => row.sender === 'Location_Recall_LTMI' && row.ended_on !== 'skipped' && row.block === this.parameters.block && row.repetition === this.parameters.repetition
);

// filter by Colour_Recall
const color_filtered_data = this.options.datastore.data.filter(
  row => row.sender === 'Colour_Recall_LTMI' && row.ended_on !== 'skipped' && row.block === this.parameters.block && row.repetition === this.parameters.repetition
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
                  "content": " \u003Cdiv class=\"centered-container\"\u003E\r\n \u003Cdiv class=\"block-feedback\"\u003E\r\n    \u003Ch1 style=\"text-align: center; font-size: 28px;\"\u003EBlock Feedback\u003C\u002Fh1\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\r\n  \u003Cdiv class=\"skills-container\" id=\"skillsContainer1\"\u003E\r\n    \u003Cp style = \"font-size: 28px\" id=\"fontLocation\"\u003ELocation:\u003C\u002Fp\u003E\r\n    \u003Cdiv class=\"skills-bar\"\u003E\r\n      \u003Cdiv class=\"skills-range\"\u003E\u003C\u002Fdiv\u003E\r\n      \u003Cdiv class=\"indicator-circle\" id=\"locationIndicator\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n    \u003Cp class=\"skills-label\" style=\"font-size:50px; color: green; font-weight: bold;\"\u003E&#x2713\u003C\u002Fp\u003E\r\n    \u003Cp class=\"skills-max-label\" style=\"font-size:50px; color: red; font-weight: bold;\"\u003E&#x2717\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\r\n  \u003Cdiv class=\"skills-container\" id=\"skillsContainer2\"\u003E\r\n    \u003Cp style = \"font-size: 28px\"\u003EColour:\u003C\u002Fp\u003E\r\n    \u003Cdiv class=\"skills-bar\"\u003E\r\n      \u003Cdiv class=\"skills-range\"\u003E\u003C\u002Fdiv\u003E\r\n      \u003Cdiv class=\"indicator-circle\" id=\"colorIndicator\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003C\u002Fdiv\u003E\r\n    \u003Cp class=\"skills-label\" style=\"font-size:50px; color: green; font-weight: bold;\"\u003E&#x2713\u003C\u002Fp\u003E\r\n    \u003Cp class=\"skills-max-label\" style=\"font-size:50px; color: red; font-weight: bold;\"\u003E&#x2717\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fdiv\u003E\r\n\r\n\u003Cfooter style=\"position: absolute; width: calc(100% - 2.4%); bottom: 1.2%; left: 1.2%; right: 1.2%; text-align: center;\"\u003E\r\n    \u003Cbutton id=\"buttonSubmit\"\u003ENext→\u003C\u002Fbutton\u003E\r\n  \u003C\u002Ffooter\u003E\r\n\r\n\r\n",
                  "tardy": true
                },
                {
                  "type": "lab.html.Page",
                  "items": [
                    {
                      "type": "text",
                      "title": "\u003Cheader\u003E \u003Ch1\u003EBreak \u003C\u002Fheader\u003E \u003C\u002Fh1\u003E",
                      "content": "\u003Cdiv class= \"message\"\u003E\n\u003Cdiv\u003E\n  \u003Cspan id=\"messageSame\" \u003E\u003C\u002Fspan\u003E\n  \u003Cspan id=\"messageNew\" \u003E\u003C\u002Fspan\u003E\n  \u003Cspan id=\"messageEnd\" \u003E\u003C\u002Fspan\u003E\n\u003C\u002Fdiv\u003E\n\n"
                    }
                  ],
                  "scrollTop": true,
                  "submitButtonText": "Next→",
                  "submitButtonPosition": "right",
                  "files": {},
                  "responses": {
                    "click button": "Next"
                  },
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
//Repetition feedback options 
if (this.state.repetition <= 3) {
    document.getElementById('messageSame').innerHTML = "<p> Great! Take a short break before we try that again with the <b> same </b> objects. </p> <p> Click 'Next' when you are ready to move on. </p>";
} else {
    if (this.state.set_counter < 2 || this.state.repetition < 4) {
        document.getElementById('messageNew').innerHTML = "<p> Thanks! When you are ready you will learn a <b> new </b> set of objects. </p> <p> Click 'Next' to move on.</p>";
    } else {
        var messageEnd = "<p> Well done! You have now completed the task. The final section will ask for your feedback </p> <p> Click 'Next' when you are ready to move on. </p>";
        document.getElementById('messageNew').innerHTML = messageEnd;
    }
}
}
                  },
                  "title": "Block_Break_Screen",
                  "tardy": true
                }
              ]
            }
          }
        },
        {
          "type": "lab.html.Page",
          "items": [
            {
              "required": true,
              "type": "html",
              "content": "\u003Cheader\u003E\n  \u003Ch1 id=\"instructionHeader\"\u003EMotivation Questionnaire\u003C\u002Fh1\u003E\n\u003C\u002Fheader\u003E\n\u003Cp style=\"font-size: 24px; position: center\"\u003E Thank you for completing the computerised memory task. The final section asks about what motivated you to complete the research. It will only take a few minutes. Click \"Next\" to move on. \u003C\u002Fp\u003E\n",
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
            "after:prepare": function anonymous(
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
          "title": "SMS_begin",
          "width": "l"
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
          "title": "SMS_Questionnaire_S1",
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
              "responses": {
                "": ""
              },
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
          "content": "\u003Cheader\u003E\r\n  \u003Ch2\u003E Thank you very much for your participation. The experiment is over. \u003C\u002Fh2\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Ch3 style=\"text-align: center; color: red;\"\u003EPlease click on this link to confirm your participation and return to the Prolific website:\u003C\u002Fh3\u003E\r\n\u003Cp style=\"text-align: center; font-size: 20;\"\u003E\u003Ca href=\"https:\u002F\u002Fapp.prolific.com\u002Fsubmissions\u002Fcomplete?cc=C43KAGK7\"\u003Ehttps:\u002F\u002Fapp.prolific.com\u002Fsubmissions\u002Fcomplete?cc=C43KAGK7\u003C\u002Fa\u003E\u003C\u002Fp\u003E\r\n\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n  \u003Csection class=\"w-l text-justify\"\u003E\r\n    \u003Cimg src=\"${ this.files[\"Pier_art.jpg\"] }\" width=\"700\"\u003E \u003C\u002Fimg\u003E\r\n    \u003Cfigcaption style=\"font-size:11px\"\u003EM Bleichner: Good Old Brighton Pier\u003C\u002Ffigcaption\u003E\r\n  \u003C\u002Fsection\u003E\r\n\u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n\r\n\u003C\u002Ffooter\u003E",
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
          "content": "\u003Cheader style=\"color: red;\"\u003E\r\n    \u003Ch2\u003EGreat! Your payment response has been recorded.\u003C\u002Fh2\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Cp style=\"text-align: center; margin-left: auto; margin-right: auto; margin-top: 20px;\"\u003E\r\n  \u003Cb\u003E IMPORTANT: \u003C\u002Fb\u003E You will have already received an email with the link to the next test session (Session 2). \r\n  \u003Cbr\u003E\u003Cbr\u003EThis needs to be completed in the next 48-72 hours (i.e., in the next 2-3 days) and will take around an hour to complete. \u003Cbr\u003E We will also email you a reminder with this link shortly.\r\n  \u003C\u002Fp\u003E\r\n\r\n \u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n    \u003Csection class=\"w-l text-justify\"\u003E\r\n      \u003Cimg src=\"${this.files[\"Pier_art.jpg\"]}\" width=\"700\" alt=\"Good Old Brighton Pier\"\u003E\r\n      \u003Cfigcaption style=\"font-size: 11px\"\u003EM Bleichner: Good Old Brighton Pier\u003C\u002Ffigcaption\u003E\r\n      \u003Cbr\u003E\r\n      \u003Ch3 style=\"text-align: center;\"\u003E You may now close the browser window. \u003C\u002Fh3\u003E\r\n    \u003C\u002Fsection\u003E\r\n  \u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n\u003Cbutton id=\"buttonSubmit\"\u003EEnd experiment→\u003C\u002Fbutton\u003E\r\n\u003C\u002Ffooter\u003E\r\n\r\n\r\n\r\n",
          "skip": "${this.state.Link_origin != 1}",
          "tardy": true
        }
      ]
    }
  ]
})

// Let's go!
study.run()
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    var cardTitle = "Hello to everyone here."
    var speechOutput = "You can ask Alexa to say hello to someone."
    callback(session.attributes,
        buildSpeechletResponse(cardTitle, speechOutput, "", true));
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == 'IntroIntent') {
        handleIntroRequest(intent, session, callback);
        //handleTestRequest(intent, session, callback);
    }
    else if (intentName == 'HiIntent') {
        handleHiRequest(intent, session, callback);
        //handleTestRequest(intent, session, callback);
    }
    else if (intentName == 'InstructionsIntent') {
        handleInstructionRequest(intent, session, callback);
        //handleTestRequest(intent, session, callback);
    }
    else if (intentName == 'HowDidIDoIntent') {
        handleHowDidIDoIntentRequest(intent, session, callback);
        //handleTestRequest(intent, session, callback);
    }
    else if (intentName == 'FunIntent') {
        handleFunRequest(intent, session, callback);
        //handleTestRequest(intent, session, callback);
    }
    else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}
function handleIntroRequest(intent, session, callback) {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("<speak><p>Hi, my name is Alexa.</p><p>I will be your guide today.</p><break time='1s'/><s>I am very shy.</s><s>Because this is a big room, I need everyone to help me.</s><break time='2s'/><s> We are going to have a lot of fun.</s><break time='1s'/><s> I am very excited to see what you guys do today.</s><s> Did you guys meet Mike? </s><break time='1s'/><s>I think he is here somewhere.</s></speak>", "", "true"));
}
function handleHiRequest(intent, session, callback) {
  var name = intent.slots.PersonName.value;
  callback(session.attributes,
        buildSpeechletResponseWithoutCard("<speak><p>Welcome everyone.</p><s> Thank you for joining us here today. </s><s>Also a special hello to " + name, "</s></speak>", "", "true"));
}
function handleInstructionRequest(intent, session, callback) {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("<speak><p>Today we are going to play with the ball that Mike is holding.</p><p> This is not an ordinary ball, but a magical robot.</p><p> The robot's name is Spark. Spark is more than a ball or a robot, it’s your vehicle to discovery.</p><p> Spark allows us to have fun and complete activities as well as be in inspired through connected play. Spark is going to teach us how easy it is to code.</p><p> Well Spark and Mike.</p><s>Mike, do you want to do something today?</s><s>I can't do everything you know.</s><s> I think Mike should show you the app, while I go and get a cup of tea.</s></speak>", "", "true"));
}

function handleHowDidIDoIntentRequest(intent, session, callback) {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("<speak><p>That was perfect Mike.</p><p>Do you not agree guys?</p><break time='1s'/><p> As Mike showed, the Spark Lightning Lab app allows anyone to program their robot in a quick and easy way. It is so easy to do.</p><p> Your robot will be able to move based upon what you drag and drop into place from the options at the bottom.</p><p> Just drag the blocks you want to use to make the ball move onto the program.</p><p> This is going to make learning how to code fun.</p><break time='1s'/><s>The trick when you code is to test as you go. </s><s>This allows you to see if it works or what you need to do to fix it.</s><s>Coding never works first time.</s><s>It is perfectly ok to change the code until it works.</s></speak>", "", "true"));
}

function handleFunRequest(intent, session, callback) {
  var name = intent.slots.PersonName.value;
  callback(session.attributes,
        buildSpeechletResponseWithoutCard("<speak><p>Well if " + name + " wants to have fun, I guess its time to have some fun.</p><p> Today we would like you to work in teams to think about how to move your robot through the maze and win the race.<break time='1s'/></p><p> I even think we have some prizes for the winners.</p><p> Don't we Mike?</p><s>I love prizes.</s><s> I bet " + name + " loves prizes too.</s><break time='1s'/><s>I think its about time I stop talking and you guys get coding.</s><s>Spark won't move by himself.</s><break time='1s'/><s> Or, will he?</s><break time='1s'/><s> Mike over to you.</s></speak>", "", "true"));
}



// ------- Helper functions to build responses -------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "SSML",
            ssml: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

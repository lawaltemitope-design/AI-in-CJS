import { useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import "./styles.css";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwKCRHom5SxNdPUD7fNNo5oP1Q68nwHv8",
  authDomain: "analysis-app-13e3d.firebaseapp.com",
  projectId: "analysis-app-13e3d",
  storageBucket: "analysis-app-13e3d.firebasestorage.app",
  messagingSenderId: "118737255935",
  appId: "1:118737255935:web:83b7d24b39e7b2471abbca",
  measurementId: "G-T7P4X4VQ99",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// ─── Your Original Data ───────────────────────────────────────────────────────
const initialData = [
  {
    id: "t1",
    theme: "Current landscape of AI use and applications",
    themeDesc:
      "This theme captures existing and emerging AI technologies currently explored or implemented within policing, categorising their primary functions and contexts of use, and identifying examples of operational or pilot deployments.",
    codes: [
      {
        id: "c1",
        code: "Automation and demand reduction",
        desc: "This code captures the use of AI to automate routine or administrative tasks in policing, with the aim of reducing workforce demand and enabling officers to focus on core operational duties. It includes tools for transcription, redaction, drafting, and other time-consuming administrative functions.",
        quotes: [
          `"We have a whole list of all the different projects…but most of them in respect of policing focus at the moment is around automation and where we can reduce demand on our workforce so that they can go out and do their policing roles as opposed to some of the administrative tasks some of our systems have developed over time and made more onerous". (Interview 8)`,
          `"We've got some projects on […] the use of AI to speed up the document redaction process, whether it's text or audiovisual files, in the evidential, not just in the investigative process but also when it comes to Freedom of Information Act requests for body-worn video footage and so on because that takes an inordinate amount of officer time using current technology" (Interview 3)`,
          `"AI and automation is at the forefront of a lot of work that's going on in [policing]" (Interview 9)`,
          `"Reading and coding all those free text fields was taking the survey team an enormous amount of time... so we did some topic modelling and created a process for them so it automatically created topics and display them for them on a dashboard…We're working on transcription and translation services... generally speaking Whisper, or WhisperX" (Interview 13)`,
          `"If forces aren't using AI for transcription, surely they're going to be, not least because it's an area where the tool's now really good" (Interview 16)`,
          `"The correspondence drafter at the moment is only for one dedicated piece of work, so we could open that up and use it for other types of dedicated work like witness warnings or witness availability, that kind of thing that's routine, types of work. Although, the correspondence drafter isn't being used for a routine task. It's [currently] used to assist a task at the moment…what the drafter will do is they will go into the case management system and pull out that information and put it in a draft letter" (Interview 18)`,
          `"[There are] tools that are looking to automate disclosure schedules, identify what is most personal in an investigation, what requires disclosure, what doesn't require disclosure" (Interview 19)`,
          `"There's absolutely no brainers for transcription and translation technology" (Interview 19)`,
          `"We have been commissioned by policing and the Home Office to look at AI opportunities within police contact centres… [The AI post-call analysis tool] takes the recordings, the audio recordings, of phone calls to police and it transcribes them and summarises them and also what's called categorises them" (Interview 20)`,
          `"We (CPS) also use Copilot and Copilot is not used with casework at the moment… [We use it] for summarising meetings, for writing terms of references and things like that, but not meetings that involve casework, not documents that involve personal data from members of the public at this time" (Interview 21)`,
          `"There is potential streamlining opportunities that AI can really bring to not only law enforcement and… the wider criminal justice system… There are efficiency gains that can help ease kind of administrative processes" (Interview 22)`,
        ],
      },
      {
        id: "c2",
        code: "Chatbots, rapid video response, and contact management centre elements",
        desc: "This code captures references to AI-driven chatbots and related contact management systems used in public engagement or call-handling functions. It includes tools designed to triage queries, provide automated responses, or assist human operators in managing communications with the public.",
        quotes: [
          `"Quite a lot of work looking at AI in force control rooms, primarily around automatically transcribing calls and to improve management data to free up the call handler to focus on the call" (Interview 3)`,
          `"Other things [...] they sit quite a lot in an investigative perspective, so some are either being trialled associated with chatbots and elements around the contact management centre, others are associated with witness statements" (Interview 8)`,
          `"rapid video response…is an innovation that came in through ERIN, or the Eastern Region Innovation Network…that is domestic abuse using the rapid video response…instead of waiting 14 hours for an officer to turn up at your address you now can speak to somebody within minutes via rapid video. That's been rolled out and tested in other forces…whether it's AI focused or whether AI is involved in that engagement with the contact management first of all and then directs it that way, I don't know." (Interview 8)`,
          `"we've been evaluating the impact of enhanced video response which is using video technology to respond to calls… Enhanced video response in its basic form doesn't use AI. It's just a video contact so you click on a link, it provides you a video link to a police officer. It's not AI enabled" (Interview 7)`,
          `"And then there's things like the use of [AI] to help with identifying calls that have potential harm in a call queue so that you're trying to work out whether any of the things that are already queueing... can you identify in this queue anything that's potentially more harmful" (Interview 7)`,
          `"There's quite a lot of forces that have been using or starting to utilise chat bots in a similar way to you would with Amazon or equivalent and utilising a victim's portal that has the use of large language models that go and scrape data from systems, so a company called Salesforce are quite prominent in this space and a number of forces have been utilising that technology for a little bit of time now, and that's been used in Thames Valley Police, Merseyside and a few others" (Interview 19)`,
          `"You've then got a couple of tools that have been used or obvious tools that have been in use... the first one is Andi-Esra which is something you may have heard of but it's being used in the West Midlands which is using AWS technology, quite rudimentary Alexa technology, just voice pattern recognition stuff that then just gives you automatic voice recognition transcription, what's being said, where does that need to go, summarising it" (Interview 19)`,
          `"[There's] classification, the ability to transcribe data and then using a large language model to then pick out specific elements of that data that might indicate higher threat, harm or risk, and this is a product called, or a company, called Untrite who have done this" (Interview 19)`,
          `"[The Untrite real-time tool is] an AI digital assistant that helps a call handler whilst they're dealing with a call… it is both an agentic and a generative AI tool that essentially listens to the call" (Interview 20)`,
          `"[I]t was a surprise for me to hear that in the immigration tribunals they are using a Copilot which they say has been tailored towards the purposes of that tribunal…[also] I was speaking to an immigration judge the other day… and she was told that the judiciary have their own Copilot which drafts judgements which they seem to have invested in trying to get to finesse" (Interview 25)`,
        ],
      },
      {
        id: "c3",
        code: "Witness statements writing",
        desc: "This code captures references to the use of AI tools in drafting, structuring, or assisting with the preparation of witness statements. It includes applications that automate transcription, summarisation, or language generation to support officers in producing accurate and consistent documentation.",
        quotes: [
          `"Other things...they sit quite a lot in an investigative perspective, so some are either being trialled associated with chatbots and elements around the contact management centre, others are associated with witness statements " (Interview 8)`,
          `"Currently what we are looking at in Hertfordshire, we're working with a company called Anathem that are working in the AI world in terms of Large Language Models for transcriptions purposes and for witness statements is the project we're working on primarily […] that conversation is listened to by the software. The conversation is transcribed. The audio is recorded and at the end of that process the AI is then generating a witness statement that's coordinated into a five-part witness statement that looks at the points to prove of the offence that is being talked about" (Interview 2)`,
          `"Essex are – what we're doing with Anathem they're doing with GoodSAM [...] what GoodSAM are now offering is an AI capability for transcription and they're looking at witness statements through that process, so very similar function to what we're doing with Anathem" (Interview 2)`,
          `"There is an overlay of Copilot in M365. There's the chat functionality which allows documents to be plugged into Copilot that then can be summarised. Multiple documents can be looked at. It assists officers with writing reports" (Interview 2)`,
          `"tuServ is the functionality that officers have on their laptops so when they're out and about they write their statements through Two Serve currently. They submit crime reports through tuServ" (Interview 2)`,
          `"[There is] the use of, well and you would have seen it through something called project ADA and Anathem but GoodSam have a similar technology... using transcription summarisation and generation of evidence with audio or visual data input. Now that's in trials in different forces, is of interest, has been shown to not be hugely effective" (Interview 19)`,
          `"[It's] the same with Axon body worn video and the use of, again, the same processes [transcription, summarisation, generation]... the automatic speech recognition technology within OpenAI, et cetera just isn't sophisticated enough to deal with the noisy environments that they're being deployed in" (Interview 19)`,
          `"[The police] were looking at… transcription of victim statements… they would sit and have a conversation with a victim but it would be transcribed by an AI tool. The victim would have to read it and say yes, we agree with it, but then what they would do is they would give the transcription, the summary and the full transcription, to CPS" (Interview 21)`,
          `"[A] large language model… was recording the interview of an officer and a witness. It would then produce an AI generated transcript of that conversation and then it would use that transcript to produce an MG11. So an MG11 is the witness statement of what the witness said… The premise is that it would increase… the speed in which the MG11 are produced so… whilst you still have them on the call, it would be generating in real time so you were able to effectively get the witness to have a look at the statement and agree it there and then" (Interview 22)`,
          `"AI might more speedily produce the transcript of the interview of the victim, but generally prepared it you watch that because you want to see them yourself anyway. So, it wouldn't replace the exercise of actually watching the ABE, the achieving best evidence interview" (Interview 25)`,
        ],
      },
      {
        id: "c4",
        code: "Digital forensics",
        desc: "This code captures the use of AI in digital forensics, including applications of natural language processing to identify patterns, extract information, and analyse data from digital devices. It encompasses tools designed to accelerate the review of mobile phone content or other digital evidence, for example in cases involving violence, drugs, or other criminal activity. (Interview 8)",
        quotes: [
          `"we're also looking at particularly the digital forensic arena, natural language processing, looking at patterns of language and being able to do extraction methodologies with additional forensic piece as well." (Interview 8)`,
          `"In digital forensics where they're looking at mobile phone,devices and they're looking at patterns of language that might be associated for example with violence against women and girls or language associated with drugs. They're trying to build some models to be able to do some of that work within digital forensics much faster. That's been trialled at the moment with partners with a couple of universities to undertake that concept and a model was being developed. Now it needs to be taken on a little bit further and progressed further but when you're faced with a lot of data by putting these processes or this model in place we can bring out some of that information or patterns that might be missed if we didn't have that kind of model over the top of the mobile phone and the technology that's been employed." (Interview 8)`,
          `"There are data integration and exploitation tooling like Palantir, and they are utilising AI technology to summarise data and support that summarisation of data across multiple different workstreams" (Interview 19)`,
          `"[There are] tools like Söze which is more an investigative [tool] which is just basically... all pattern matching, so the ability to look at... whether it's visual, audio, et cetera data, the ability to then go, there's a photo here that corresponds with this bank statement over here, and then basically go here you go investigators" (Interview 19)`,
        ],
      },
      {
        id: "c5",
        code: "Automatic redaction of case files",
        desc: "This code captures the use of AI tools for the automatic redaction of case files. It includes applications designed to identify and obscure sensitive information efficiently, supporting investigators in maintaining confidentiality while reducing manual effort. Examples include pilot projects and national rollouts demonstrating accuracy and low rates of false positives (Interview 8)",
        quotes: [
          `"Automatic redaction of case files, that's Bedfordshire Police, so the aim is to develop a tool that investigators can use to speed up the process of redaction. That is 2023, completed in 2023." (Interview 8)`,
          `"Other things that have been rolled out is redaction, so that's been trialled but it's now going via national rollout and then the College of Policing are looking at that in more detail in respect of productivity." (Interview 8)`,
          `"The pilot programme for redaction was conducted to assess performance and viability within the force. It was performed in a controlled environment involving a representative sample of documents. High level of accuracy identified and identified and redacted sensitive information. The force positive rate was consistently low. User experience feedback, compliance and security integration interoperability and the benefits have been mapped." (Interview 8)`,
          `"[We've been looking at] tools which incorporate generative AI such as large language models that are primarily used for administrative tasks like transcription, summarisation, redaction, those kind of tasks" (Interview 17)`,
          `"If I'm using Adobe and I have to go into a witness statement and I have to look and see if there's an address in there or if there's a name of another witness in there which is not to be shared, this new Adobe tool would highlight that for me to check it so I wouldn't have to actually read all the documentation... it would automatically highlight like something that it would identify as a number plate or as a home address or as a bank number" (Interview 18)`,
          `"There's redaction tools that have been discussed… You've got [Riven DocDefender], which is a redaction tool. You've also got Pimloc [SecureRedact] which also is another redaction tool as well… I know that [Riven DocDefender] is in 32 forces, 33 if you include other law enforcement agency" (Interview 22)`,
        ],
      },
      {
        id: "c6",
        code: "LLMs for verification and information retrieval",
        desc: "This code captures references to the use of large language models to support checking, searching, or retrieving information. It includes applications where LLMs are used to verify facts, cross-check data, summarise records, or assist users in locating relevant information across documents or databases.",
        quotes: [
          `"one of the things that [the College of Policing is] doing internally is a series of large language model trials where it's basically providing checking support to officers… It's not about producing a document; it's about checking that the document that has been produced is meeting the criteria in order to provide an additional support to officers" (Interview 7)`,
          `"The College [of Policing] search [tool] that we're testing is officers being able to ask plain English questions and the answers will draw on all of the preloaded college material, Crown Prosecution Service and government legislative material" (Interview 7)`,
          `"[COPPA AI tool works] like a Google for cops where you could search for something, and it would tell you…it is only to use what's in that AI library which is all official guidance…it doesn't go out to the web, it's not to use its own knowledge, its own training" (Interview 12)`,
          `"predictive coding is machine learning rather than generative AI at this moment in time. And what they found in the US is it's a much more accurate system than humans and it's far, far quicker" (Interview 15)`,
          `"we built…basically glorified RAG with a bit of pre-prompting in the back end..for our Board that I sit on and it has access to our sharepoint library of historic board papers and agendas and minutes" (Interview 15)`,
          `"I'd be surprised if people aren't experimenting with the use of large language models but again this is very rapidly going to get into the question of where and how do you use them and how do you trust them" (Interview 16)`,
          `"I think defining those [generative AI tools] as exclusively administrative can be a bit of a misnomer because we're seeing LLMs be integrated into the... more substantive investigatory tasks" (Interview 17)`,
          `"[We're looking at a] legal and policy one and that is when a prosecutor is looking to charge somebody with [an offence]... it will pull up the legal policies that will help them decide where the charge lies" (Interview 18)`,
          `"[The Untrite real-time tool] identifies elements within that call that are capable of being searched for on the police database, so things like names, addresses… It automatically searches all of the other police databases that we have and brings all the information back for the human to review" (Interview 20)`,
          `"The communications drafter is a tool that helps us draft letters to victims… it's basically extracting information from our case management system and helping populate a letter template" (Interview 21)`,
          `"The police in particular [are] kind of looking at large language models, that's a real prominent one" (Interview 22)`,
        ],
      },
      {
        id: "c7",
        code: "Object recognition",
        desc: "This code captures references to AI systems designed to identify, classify, or track physical objects in images, video, or sensor data.",
        quotes: [
          `"I think one of the other ones that there is a test of this in Cumbria [...] is object recognition. This would be in the context of CCTV material, so being able to find all the instances of dot, dot, dot, whatever it is" (Interview 7)`,
          `"There's a piece of software called BriefCam that they are... trialling... It has facial recognition, but it's not turned on. It enables the searching of CCTV footage... you can filter that CCTV, so it only returns people wearing blue jumpers" (Interview 13)`,
          `"[Secure Redact] deterministically detects and tracks a range of specific entities, people, faces, heads, licence plates, text in the seen as well as digital text…" (Interview 14)`,
          `"The use of object recognition, I think, is really interesting broader than that [facial recognition], so auto trawling of CCTV, lines of enquiry also rather than reviewing forty hours of CCTV over an investigation, actually just bringing that down to well you need to just review these fifteen minutes" (Interview 19)`,
        ],
      },
      {
        id: "c8",
        code: "Facial recognition",
        desc: "This code captures references to AI systems that detect, identify, or verify individuals based on facial features.",
        quotes: [
          `"We have a couple different facial recognition tools but they are retrospective…if you have someone in custody you can check their image against the National Database" (Interview 13)`,
          `"[There is] the use of object recognition, so broadly facial recognition... from a live facial recognition to retrospective and officer [initiated] investigations, identification of missing people" (Interview 19)`,
          `"I'm aware of different facial recognition systems which again I think they've got AI underpinning them, or some of them do at least" (Interview 23)`,
        ],
      },
      {
        id: "c9",
        code: "Robotic Process Automation",
        desc: "This code captures references to the use of software-based automation tools that perform routine, rule-based tasks traditionally carried out by humans.",
        quotes: [
          `"there is the potential for us to use things like robotic process automation to clean data up. There are forces who are doing that and who are sharing how they've been doing that with other forces so there's definitely potential there […] The robotic process automation is just the basics of go and find this record" (Interview 7)`,
          `"I think when you look at things like document automation and things like that those rulesbased systems can still be really, really valuable, especially in law where actually what you're looking for a lot of the time is consistency" (Interview 15)`,
        ],
      },
      {
        id: "c10",
        code: "Case classification and flagging",
        desc: "This code captures references to the use of AI to automatically identify, verify, or assign case-type markers to incoming cases.",
        quotes: [
          `"Case markers is another one we're looking at so whenever a case comes in from the police they usually are marked what type of case it is... it's looking at how it [AI] can easily mark those cases or easily check the cases to make sure the markers are there and identify any that's missing" (Interview 18)`,
        ],
      },
      {
        id: "c11",
        code: "Scope of AI projects",
        desc: "This code captures references to the scope and coverage of AI projects within policing.",
        quotes: [
          `"There's quite a wide range of…STAR projects around…the AI space…But I know it's very focused probably on the crime scene to court and the investigation journey." (Interview 8)`,
          `"I believe it [the correspondence drafter] went live in July [2024]...this is our first tool that we've gone live with" (Interview 18)`,
          `"Policing receives 33 million telephone calls a year. That's about 20 million non-emergency and about 13 million emergency calls" (Interview 20)`,
          `"We're [CPS] testing lots of other things but there's nothing else in production at the moment, there's only those two things [the Correspondence Drafter and Copilot]" (Interview 21)`,
          `"No [Research Development & Innovation (RDI)] strategy would be complete without a huge reference to AI" (Interview 24)`,
          `"It's all at the investigation stage, pre-court stage, that I'm aware of, of where things are being used at the moment" (Interview 25)`,
        ],
      },
      {
        id: "c12",
        code: "'Hidden' Enterprise AI",
        desc: "This code captures the observation that the most widespread AI impact often comes from invisible features embedded in standard enterprise software.",
        quotes: [
          `"In a weird way those integrated AI features of existing enterprise tools are probably going to be the biggest impact... even if they're probably going to be the least noticed" (Interview 13)`,
          `"We are now pretty much Enterprise with 365 Copilot. Everyone in the firm has a licence" (Interview 15)`,
          `"Whenever we're upgrading software, where the AI's been introduced, when we're renewing our contracts [we check whether] AI is now being introduced" (Interview 18)`,
        ],
      },
      {
        id: "c13",
        code: "Predominantly exploratory",
        desc: "This code captures references to the developmental stage of AI projects, highlighting those that are predominantly exploratory or in pilot phases.",
        quotes: [
          `"Most of [the AI projects] are within the exploratory phase, but there are things that are redactions, for starters, has been rolled out." (Interview 8)`,
          `"I'm not sure what phase [the legal policy tool is at]" (Interview 18)`,
          `"The majority of the tools that are in production are COTS solution, so off the shelf solutions" (Interview 19)`,
          `"I had a quote the other day... the tech editor for the BBC said AI is like teenage sex, everyone says they're doing it but no one's really doing it, and I think that is nearly true in policing" (Interview 19)`,
          `"We are [currently] repeating the test [of the AI post-call analysis tool] with Hertfordshire Police" (Interview 20)`,
          `"Right now a lot of the engagement that I'm doing is forces reaching out to us [CPS] as part of the early engagement" (Interview 22)`,
          `"I'm not aware of us… using [AI] in Police Scotland at the moment." (Interview 24)`,
          `"[AI adoption] all seems a little distanced away from [the Bar] at the moment" (Interview 25)`,
        ],
      },
      {
        id: "c14",
        code: "Third-party involvement / market-share",
        desc: "This code captures the role of commercial partners, technology vendors, and external organisations in the development, supply or hosting of AI tools.",
        quotes: [
          `"the vast majority of…[AI] tools…being deployed by the police, is open source or commercial built by someone else" (Interview 3)`,
          `"if you looked at it from a criminal law perspective it doesn't make sense for every criminal firm, every criminal barrister in the country et cetera to be developing their own solutions for these things" (Interview 15)`,
          `"Good Sam is a particular provider which are looking at developing [a] large language model to help… with transcription and translations to reduce MG11s" (Interview 22)`,
        ],
      },
    ],
  },
  {
    id: "t2",
    theme: "Familiarity and perception",
    themeDesc:
      "This theme encompasses respondents' knowledge of and experience with AI tools, as well as their understanding, interpretations, and perceptions of what AI is and how it functions.",
    codes: [
      {
        id: "c15",
        code: "Limited direct AI use",
        desc: "This code captures instances where respondents report minimal or infrequent use of AI in their work.",
        quotes: [
          `"In respect of use of AI, I would say limited" (Interview 8)`,
          `"In the criminal justice system, within barristers chambers there is very limited use of AI" (Interview 9)`,
          `"Up close the only one I've seen demos of and use of is the Axon Draft One at a conference" (Interview 17)`,
          `"My knowledge of AI is limited" (Interview 25)`,
        ],
      },
      {
        id: "c16",
        code: "Initial Excitement",
        desc: "This code captures references to early reactions to AI adoption, reflecting both enthusiasm for its potential benefits.",
        quotes: [
          `"We're quite excited about the opportunities [AI presents] but we can't really understand it at the moment in time and therefore are cautious around the risks because anything we don't understand invariably gives us options to be bitten or to be caught out or to effectively do something wrong, which of course we don't want" (Interview 5)`,
          `"When I hear the word AI… I probably think of new opportunities… There is a lot of opportunities that are possible with AI, but they don't… always come with their risks and mitigations… I think within the professions of the criminal justice system… we're [at the] beginning of our journey and realising what the benefits could potentially be" (Interview 22)`,
        ],
      },
      {
        id: "c17",
        code: "Scepticism and fear",
        desc: "This code captures references to doubts, apprehensions, or negative emotions regarding the use of AI in policing and the criminal justice system.",
        quotes: [
          `"AI is a term that scares some people in law enforcement…every time I mentioned AI in my department…people's kind of whoa, hang on, just because they've been brought up on movies that feature AI like Skynet in Terminator and stuff like that where it all goes haywire." (Interview 1)`,
          `"Policing is really quite sceptical. We do like our technology, I think it's fair to say, we do like the potential of it, but we also have a very healthy curiosity and caution around exactly how does it work and what are the risks and what are the benefits" (Interview 5)`,
          `"people do find [AI] a bit scary partly because they find tech scary generally, partly because of all the Terminator style end of days kind of stuff that people talk about in the press" (Interview 15)`,
          `"I'm concerned that summarisation tools will be used for drafting of court documents and I have concerns around that in terms of accountability and understanding who's written what... and it devaluing what a statement of truth means" (Interview 17)`,
          `"I think [AI adoption] should be approached in a positively cautious way" (Interview 23)`,
          `"It's about speeding everything up and I find that in almost every regard, especially in serious cases where there's a lot of material, there's no substitute for putting in the hard work and shortcuts are a worry to me" (Interview 25)`,
          `“I'm not one of these Skynet people who says it will take over the world like Terminator... but I do believe that we've got to still have that cautious…that you've got to be aware that this may not exactly be true…If I look on somewhere like Facebook I cannot trust any of the images that comes up on Facebook because there's so many [AI-generated ones]... I don't even look at them anymore because I don't even believe them because you don't know what to believe” (Interview 18)`,
          `“I went to various digital conferences in 2024 and it was AI is the silver bullet that's going to solve everybody's woes and it's going to transform what we do and we're not going to need anybody anymore, and then last year when I went the language had subtly changed around what problem is it that you're looking to solve and then how does AI contribute to the solution, if it contributes to the solution, which is a space I'm much more comfortable in” (Interview 24)`,
        ],
      },
      {
        id: "c18",
        code: "Historical parallels",
        desc: "This code captures references to comparisons between current AI adoption in policing and past technologies, policies, or innovations.",
        quotes: [
          `"I think if you look back to all the advances in policing, so fingerprints and DNA and CCTV and all those kind of things, I'm sure there was concerns around the introduction of those as well." (Interview 1)`,
          `"It will be like the mobile phone journey which started like this and now we're into this" (Interview 24)`,
          `"Before that, we're probably going back to DNA in the early nineties to look at what was brand new, and it seems to me that the use of AI maybe have that sort of character that once it lands fully you're going to get a huge raft of litigation and appeals before the Court of Appeal" (Interview 25)`,
          `“I was on a course the other day that told me what the name for recurring challenges, patterns of it was...an AI winter, so the first one was 1974 to '80 and then adoption, or cautionary the second one was '87 to '93 and it was just lack of funding and examples from historical interest and they think this is like a peak at the minute and there practices that inform current will be another winter is coming” (Interview 18)`,
        ],
      },
      {
        id: "c19",
        code: "Hands-on Experience",
        desc: "This code captures respondents' direct interactions with AI tools, including frequency, duration, and operational contexts.",
        quotes: [
          `"I am still trying to get my head around what [AI] actually means, what it's potential are and what the risks are. I have, unashamedly…started to play with it. It's now become my default search engine so those things have developed but I don't think I'm a heavy user of it" (Interview 5)`,
          `"I use [Copilot] quite a lot to give me a framework if I'm writing a strategy. It's very, very good at that…one of the things I found it really useful for is it searches all my files so it will look at everything, at all the information I've got and help me build a much more accurate template…I would use it in a sort of developmental work" (Interview 6)`,
          `"I use Copilot daily and I use it to write terms of references. I use it to sometimes simplify some of the content I'm writing… I always check it and I always change it a hundred per cent of the time, not because I'm setting out to do a hundred per cent of changes, just because I find that a hundred per cent of the time it doesn't quite get it right" (Interview 21)`,
          `"The AI that I use in my current role is Copilot, so we'll use Copilot for meeting minutes… There are times when the transcript… doesn't capture the words that were actually said. It will be completely different. Somebody's called Steve and it will come up with Sharon… Similarly… sometimes the summary will not be accurate" (Interview 22)`,
          `"I had a really good, interesting case recently which I chose to test the Adobe AI Reader on… It didn't pick up on the negative which as a lawyer you are looking at to try and identify the inconsistencies in the evidence… it's not just about what is there but it's about what isn't there that we have to get better at" (Interview 25)`,
          `“perhaps five per cent or less…knew anything about AI, and they flagged concerns around their use and application of it, but there was an acceptance that some of them are probably already using AI in some shape or form in their roles but just don’t realise it in respect of what they’re doing.” (Interview 8)`,
          `“I’ve used a large language model system to try and create a financial model from an excel spreadsheet and what it required was a lot of back and forth from me learning how the system was working and what it was capable of doing. It was over promising and under delivering until I realised that I would have to provide data rather than creating a hypothetical system that could be used” (Interview 10)`,
          `“Whenever I write a letter, I sometimes throw it through Copilot to say can you just redraft or make it more empathetic or take the harshness out of it, and it's been good… I did a paper for our AI steering group around Copilot and casework... and whilst I had to go through and tweak it because obviously it's for me and I wouldn't say it in that language...it definitely gets me…sometimes the hardest bit is getting started” (Interview 18)`,
          `“I have… thirty-eight years' experience in public contact… I'm not an AI specialist but I am a contact specialist and all the technologies I've seen I've not seen any commercial supplier do this [transparency of reasoning and accuracy]” (Interview 20)`,
        ],
      },
      {
        id: "c20",
        code: "Conceptual Understanding",
        desc: "This code captures respondents' knowledge of AI principles, capabilities, and limitations.",
        quotes: [
          `"[AI means] artificial intelligence, machine learning, there are the two elements I suppose" (Interview 10)`,
          `"it is a synthesis of human intelligence. It's not the same as human intelligence" (Interview 15)`,
          `"Colloquially, I use quite a wide definition that is the use of machines to perform tasks that traditionally would have required human intelligence" (Interview 17)`,
          `"A lot of people get confused around automation and AI and I'm still trying to get my head around that as well" (Interview 18)`,
          `“I understand that it is always going to be a movable feast and that you can get hung up on semantics... we’ve used the ANPR cameras for a long time... that’s a process which on a service level you could say was replicating forms of intelligence... but because it’s a solution that’s been around for ten, fifteen, twenty years in some cases, it’s not considered to be artificial intelligence” (Interview 13)`,
          `“[what is AI is] quite a nuanced question and when most people ask it what they’re actually asking is have you got an LLM in there somewhere, is kind of what they tend to mean rather than most systems having some AI in them” (Interview 14)`,
          `“my understanding of AI is relatively broad…from expert systems, statistical methods through to any of the machine learning techniques” (Interview 16)`,
          `“I'm certainly no computer scientist, no legal expert but do and have had a significant interest particularly in... the implementation and consumption of artificial intelligence” (Interview 19)`,
          `“You have to be really, really clear, what are you wanting to use the technology to do because that will then help you inform your accuracy and speed and then obviously your cost… [We assessed LLMs] across three criteria: accuracy, speed and cost. Those three levers… they're not mutually inclusive or mutually exclusive” (Interview 20)`,
          `“There is generative AI, so where it's producing content. There is AI where it's thinking and reasoning to varying degrees and varying levels. There's also automation and I find that a hard line to draw between automation and AI sometimes… Once you get into the thinking and the reasoning you're straying into AI, I would say” (Interview 21)`,
          `“Sometimes I find the difficulty distinguishing between statistical and AI, so some machine learning… for me one of the inherent defining features is that AI will start to develop its own understanding where it's other fixed methods like regression you just implement it and that's it, you don't give the model the scope to learn or change over time… I guess for me fundamentally it's that ability to learn and change and develop over time” (Interview 23)`,
          `“The distinction I make in my simple mind… is that AI can be trained to make connections across data that replicates a human type decision or interpretation of that data whereas… large language models et cetera look for, take static lumps of data and throw out patterns and learning from that without that kind of trained element to replicate decision making or interpretation” (Interview 24)`,
          `“I always treated the… DNA finding… as probabilistic and what you do is you say OK ladies and gentlemen of the jury, those are pretty good odds that it's the defendant and then you draw additional evidence… We don't have very much that's actually determinative” (Interview 25)`,
        ],
      },
      {
        id: "c_det_prob",
        code: "Deterministic vs. probabilistic AI",
        desc: "This code captures respondents' distinction between deterministic AI and probabilistic generative AI, including discussion of binary entity-detection tools versus less predictable LLM-style systems.",
        quotes: [
          `"having some language to explain a more controlled and constrained application of AI where the results are more binary... versus something where you could ask it anything and it would give you any answer" (Interview 14)`,
          `"You either accept that [the probabilistic tool is]…going to be useful but imperfect, or you say well no, because it can't possibly be deterministic" (Interview 16)`,
          `"[Secure Redact] deterministically detects and tracks a range of specific entities, people, faces, heads, licence plates, text in the seen as well as digital text…" (Interview 14)`,
        ],
      },
      {
        id: "c21",
        code: "Perceived Usefulness",
        desc: "This code captures respondents' views on AI's practical value for tasks, efficiency, and decision-making.",
        quotes: [
          `"AI will be, very soon, it will be everywhere" (Interview 9)`,
          `"I think AI could rapidly speed [cell site analysis] up" (Interview 25)`,
          `"The accuracy [of LATIS] was so much higher than we were expecting." (Interview 23)`,
          `“those […] doing more administrative roles naturally think AI will take over those administrative functions and you’ll no longer require me” (Interview 8)`,
          `“Facial recognition is only intelligence. It is never evidence…intelligence is always unreliable. It is always a on-a- scaler between false and true and it always requires a judgement call, and our officers are used to considering what does the intelligence say, what’s the source of the intelligence, what other evidence or intelligence have I got and how much weight do I cut on that intelligence…However, the algorithms have got to the point now where they are quite compelling” (Interview 5)`,
          `“[AI] could be extremely effective is in deterrent policing…[but there are concerns about] overstepping into the realms of a police state Big Brother feeling” (Interview 10)`,
          `“with summarisation [for instance] the main reason we want to reduce the use of large language models... is because we can’t see a way out of the hallucination problem... that still is probably not acceptable for a situation where you might be looking for someone and that machine... may direct you to look somewhere else…if we’re say using a language model to automatically classify records... to give us a snapshot of demand... then you might be comfortable introducing error rates like ten, fifteen per cent” (Interview 13)`,
          `“with summarisation [for instance] the main reason we want to reduce the use of large language models... is because we can’t see a way out of the hallucination problem... that still is probably not acceptable for a situation where you might be looking for someone and that machine... may direct you to look somewhere else…if we’re say using a language model to automatically classify records... to give us a snapshot of demand... then you might be comfortable introducing error rates like ten, fifteen per cent” (Interview 13) It definitely gets me started…definitely cuts out that where do I even start and sometimes once you get that it's easy to do it. Sometimes the hardest bit is getting started” (Interview 18)`,
          `“[How do you] identify those challenging points, the pinch points or the pain points where you are struggling or a human being struggles to ingest the volume or complexity of that data in a meaningful way to support decision making” (Interview 19)`,
          `“The purpose of the [AI post-call analysis] tool is to surface insight into the totality of demand… to allow contact centre leaders to then say whereabouts is our capacity being consumed, where are the opportunities to improve the caller experience” (Interview 20)`,
          `“I haven't seen efficiency yet. I've seen efficiency in automation, absolutely… But I think in Copilot it certainly doesn't make me – well, it produces a report quicker for me but in other instances I use it in scenarios when I wouldn't have used it before… So, it's actually taken me longer but you could say that the quality has improved” (Interview 21)`,
          `“I think it would be absolutely invaluable for me… in the whole horizon scanning piece… summary of documents highlighting key points. Paper generation, report generation, funding bids… Cost benefit analysis… Copilot managing my daily day to day would be of great advantage… I think it could really support the distribution of work, the allocation of casework, making intelligent summations about the types of examinations that are required” (Interview 24)`,
        ],
      },
      {
        id: "c22",
        code: "Employment Impact",
        desc: "This code captures respondents' views about how AI should enhance roles rather than replace people entirely.",
        quotes: [
          `"Copilot could remove one if not both of those individuals [executive assistant/staff officer], freeing up more police officers to actually be on the front line" (Interview 6)`,
          `"There is a massive fear that technology is going to replace people. Our own view is actually not to achieve that, it is to allow people to do what they're paid to do" (Interview 6)`,
          `"[AI] is not going to replace lawyers, but it is going to change how we work" (Interview 15)`,
          `“If you know how to direct a conversation to look at the salient points to prove …you’re looking at how you’re going to gather that best evidence. There needs to be that level of understanding there, definitely, or else the system is only going to be as good as what the conversation is” (Interview 2)`,
          `“[the main challenge is] about interpreting the output of these [AI] tools, understanding what isn’t is inaccurate, making sure there are appropriate governance arrangements in place to check accuracy and that requires training at a leadership level but also user level as well, and there is no national appropriate to that at the moment” (Interview 3)`,
          `“The vast majority of senior police officers have very little technical knowledge when it comes to technology or AI or anything else in that space” (Interview 5)`,
          `“there’s huge variation... in terms of people’s understanding of everything to do with AI really, everything from the real detail... but even having a buyer beware type level of understanding” (Interview 7)`,
          `“we’re being led by suppliers and by evaluations that are being done by policing which up until now the vigorous nature of them may have been adequate but for AI the risk that it’s being confused, if we have got people that are not aware of how our AI can work and that it needs to be transparent” (Interview 9)`,
          `“[The risk is] that the system is tilted in favour of evidence that the defence find difficult to challenge because they don’t have the tools or the knowledge because they haven’t had the training, or the awareness” (Interview 10)`,
          `“People have inflated ideas of what AI is... and it feels like a recipe for automation bias…you put something in place and then even with best practice type stuff of human in the loop that people will just go along with the system” (Interview 13)`,
          `“we’re finding a lot of people are used to using software x to do y and so spending some time with them to show them the benefits... It’s been a big learning on the policing side so we’re having to invest a lot more time on one-to-one sessions” (Interview 14)`,
          `“Maybe I'm not giving it [Copilot] the right prompt. Maybe that's part of the learning thing for me… A lot of people get confused around automation and AI and I'm still trying to get my head around that as well” (Interview 18)`,
          `“[It] requires some specific expertise... requires the infrastructure to do it and forces generally haven't built Python environments within their environments, Azure or whatever, and generally need a partner to come in and help them with that because it's more complicated than you would think” (Interview 19)`,
          `“I think one of the challenges we have in policing… [is] literacy and understanding of both data and… AI capability… I think there's a real human capability… challenge to understand where AI genuinely might add value” (Interview 20)`,
          `“The risks are user risks rather than technical risks… it's making sure our staff are mature enough to understand what they're using it for, mature enough to understand the limitations of the system, what it can't do” (Interview 21)`,
          `“We don't have a high turnover of staff in Forensic Services so most people, like I've been in forensics for thirty years, most people are in that space… so their use of technology et cetera is very much not in the current space… We have a lot of challenges with people just getting to use systems so I think there would be that… nervousness and the uncertainty and the unknown” (Interview 24)`,
        ],
      },
      {
        id: "c_fear_efficiency",
        code: "Fear of Displacement vs. Efficiency",
        desc: "This code captures the anxiety that AI-driven efficiency gains may displace staff or reshape roles in ways that create uncertainty, resistance, or concern.",
        quotes: [
          `"Copilot could remove one if not both of those individuals [executive assistant/staff officer], freeing up more police officers to actually be on the front line" (Interview 6)`,
          `"There is a massive fear that technology is going to replace people. Our own view is actually not to achieve that, it is to allow people to do what they're paid to do" (Interview 6)`,
          `"I think age is a big factor and it's about old dogs and new tricks… There are judges who when everything was digitised on the bench said that's it for me, I'm not going to involve myself in that and so retired" (Interview 25)`,
        ],
      },
      {
        id: "c_trust",
        code: "User Trust and Risk Awareness",
        desc: "This code captures respondents' perceptions of and experience with errors, biases, or unintended consequences.",
        quotes: [
          `"just because AI's advancing at a breathtaking space doesn't take away our responsibilities to at least understand how does it work and what are the risks of using it" (Interview 5)`,
          `"At the moment we say they cannot use it [Copilot] with case work because we don't know." (Interview 18)`,
          `"It's not just about what it can do, it's what it can't do, and understanding about the levels of accuracy" (Interview 21)`,
          `“what’s happening in terms of that provenance of the evidence, we would still want to see a transcription and we still want to see the audio. Yes, it might be the officer’s statement and the witness statement who have both signed it but the AI is ultimately the tool that was writing it” (Interview 2)`,
          `“You’ve got to understand what the risk of the tool getting it wrong is. You’ve got to understand what your expectation is going in and then as to whether you trust the answer the tool gives you…if you compare the risks of using the AI with risks of using a human you have a slight question of how different really are they... In the Vigil [AI] case there are risks, definitely mostly around false negatives rather than false positives, but I don’t think they’re wildly different from what you’d have with human operators” (Interview 16)`,
          `“These classic issues which have been around for a while, these concerns about over trust and under trust of automated systems…[Imagine] someone having low self-esteem because they’ve just had a run of cases that they’ve lost or they’ve just been told off by their manager and they’re feeling a bit like oh God, I can’t get anything right, I don’t trust my own judgement and then they’re told to go and be an effective human overseer in a windowless room somewhere and the computer tells them something and they go yeah, I must be wrong (Interview 17)`,
          `“The research that is involved in... from Sciencewise and then recent research from Sentric do indicate that any probabilistic prediction forecasting place or person are the highest concerned, person significantly more, place less so” (Interview 19)`,
          `“We've had some really positive comments from users who've never been anywhere near this kind of [technology who] said this is really good because I can understand it… [But] I'm very nervous around sentiment analysis for various reasons and its use in policing because I'm always told that sentiment analytics is capable of detecting… seventeen different human emotions… I'm worried that an AI tool could hallucinate on sentiment analysis if it's only hearing conversations that are of negative sentiment” (Interview 20)`,
          `“Once you have confidence in [the output of] that [AI] system that QA process can't just disappear because now you've got confidence in the AI… tool, you still have to have that level of QA in there” (Interview 22)`,
          `“It depends who's promoting it. If Paul Greaney KC… says I've spent a lot of time looking at this, I've spoken to people about it, I consider it to be reliable, then a lot of people will say well if it's good enough for Paul it's good enough for me” (Interview 25)`,
        ],
      },
      {
        id: "c_train",
        code: "Training and Guidance",
        desc: "This code captures respondents' experiences of formal or informal support, guidance, or training received to understand and use AI effectively.",
        quotes: [
          `"we ran a session to do with AI. We had 150 officers and staff over a number of workshops" (Interview 8)`,
          `"there has been no chambers training for anybody in the use of AI. Anybody who is interested in it is doing their own research" (Interview 10)`,
          `"There's this key point around general digital literacy, AI literacy and training both on general principles and also on the specific tools" (Interview 17)`,
          `“We started off with six weeks’ worth of data. It clearly was pressure about the volume of data required useless... and I think we ended up putting something close to four- to make an LLM model functional or five-years’ worth of data through [the AI system] in the end to and the time required to do that. have something that was actually useable at that point” (Interview 6)`,
          `“there definitely seems to be a need for more open tools for discovery, search and investigation in the earlier stages to actually be able to locate things in huge datasets before you then extract the bits you need and then put them through the forensic process” (Interview 14)`,
          `“whilst Gen AI is probably far easier to adopt than some of the legal tech that’s gone before, if you want to automate a document, for a start you need an actual precedent document in the first place, which takes time. Then you’ve got to actually automate the document. If you’re using machine learning you probably need a hundred examples and then someone’s got to go through and label everything up and that takes time” (Interview 15)`,
        ],
      },
      {
        id: "c23",
        code: "Human in the Loop",
        desc: "This code captures information about the role of human oversight, intervention, and judgment in AI-supported decision-making processes.",
        quotes: [
          `"whilst we're saying humans in the loop are making the decisions in respect of what the outputs it gives you you've got to still do checks and balances in respect of it and don't always think it's right" (Interview 8)`,
          `"There needs to be a charging decision made by a human. I would be extremely concerned if a computer-based system was saying there's sufficient evidence here to ground a prosecution…There still needs to be human oversight, even if material has been acquired or analysed using AI" (Interview 10)`,
          `"A developer said to me if you're not careful your human over the loop quite easily becomes your human scapegoat for poorly designed systems" (Interview 17)`,
          `"I want us to ban the term 'human in the loop' 'cause I think it's entirely meaningless and becoming more meaningless as we move forward…I think it's an incredibly lazy approach to technically assuring these products are good enough and managing them through the model lifecycle... essentially it's going to become 'human on the loop' or 'human above the loop' rather than human in the loop" (Interview 19)`,
          `"We did a bit of testing…one of the things that we did find is that the human in the loop wasn't necessarily picking up on some of these key embellishments and hallucinations" (Interview 22)`,
          `“We use [the AI tool] very much as a guide rather than an actual includes references to practices dead cert. We always try and parallel source stuff whenever we where human operators review, can in intel” (Interview 1)`,
          `“It’s the human in the loop really to ensure that anything that’s pulled across it doesn’t really work, or it hasn’t really hit the mark... it will be down to the officer’s judgement really. We’re not asking this to take away the officer’s ability to make decisions, it’s just a clerical tool really. We still want the officer to make those final judgments and decisions” (Interview 2)`,
          `“policing [is] about people interacting with people. I don’t see that changing. For the public to have confidence in policing they need to see a person who’s making the decisions that affects their lives…I think AI’s got a part to play in almost every element… but not at the expense of the human actually doing the interactions, making the decision and being the one that is accountable for whatever happens” (Interview 5)`,
          `“We should absolutely not act just because the technology said this is what I’ve found, but it should perhaps steer us to look at something closer and have a human unpick that and check and make sure that the technology hasn’t just come up with something out of the blue” (Interview 6)`,
          `“As I understand it, the [redaction] process has a human, it’s a human in the loop process…the individual is checking that the material is being redacted appropriately” (Interview 7)`,
          `“please remember this AI is designed to offer you advice and guidance, it’s not to make a decision for you... you are responsible for any actions or decisions you make…if they stand up in the dock and say well AI told me to do it, that’s not going to cut it…every single response has that on it for every single user every single time” (Interview 12)`,
          `“I don’t think you need a human to verify every zero and one that goes through the computer, but you do need a human to verify before, for example, the tool makes an amendment to a document. I don’t want a tool that’s automatically going to start amending agreements without asking for permission first and without flagging what’s actually been changed because that is a recipe for disaster, frankly” (Interview 15)`,
          `“One of the things we are very sure about, especially in all our processes at the minute, and everything we do there has to be that human in the loop… That VLU [Victim Liaison Unit] officer will then look at the draft [produced by the AI tool] and see if it's correct, look at what and tweak it as per necessary…there is that second review as well by a manager just before, so that we are absolutely sure that the correct information is included in that letter…and I'm nearly positive that at the minute it's a hundred per cent checks from the manager as well” (Interview 18)`,
          `“[The AI post-call analysis tool] doesn't make any decisions… it always just says that here is an indication of what's in this 10,000 calls that I have analysed and it's signposted the human to the relevant part of the haystack… It's always human in the loop as opposed to over the loop… [The vulnerability feature] prompts the question is there vulnerability in this call… [it is] for a human to make a decision on because the tool doesn't decide anything” (Interview 20)`,
          `“[The template and content] is then always reviewed by a person. So, it's never left just the AI has written the letter and it sits there, and we're at real pains to stress that because I think the News of the World headline is that CPS are faceless and uncaring and the AI creates the letter, and that's not the message here” (Interview 21)`,
          `“There will always be a human who is fundamentally in control of the ultimate decision, and if they [SCAS] don't like the output that's coming from the algorithm [LATIS] then they will be directed to reject that. It's really just there as a way of helping the human analysts to deal with the masses of information that they've got, but the ultimate decision-making power of course it still rests with the human, the human expert” (Interview 23)`,
          `“What goes in the eyes and ears of a jury has to be reliable evidence… and that's [the barrister’s] responsibility, so that should remove that danger” (Interview 25)`,
        ],
      },
      {
        id: "c_comp_dom",
        code: "Comparison with other domains",
        desc: "This code captures correlation as well as lessons that can be learnt from other domains in respect of responsible use of AI.",
        quotes: [
          `"There's a project with responsible AI where the NHS are providing AI champions across all their NHS domains" (Interview 8)`,
          `"DNA was the subject of all these challenges and the EncroChat, that's why I mentioned it" (Interview 25)`,
          `“Ironically the MoJ use algorithms for pretty much who's going to make the next cup of tea and it's really interesting to see that we [policing] haven't either invested in that or it's just not been a priority, or actually we're obviously publicly we care a bit less about those who have been convicted and the processing of their data to identify risk of reoffending than we do around prevention of offences in the first place” (Interview 19)`,
        ],
      },
      {
        id: "c_pub_perc",
        code: "General public's perception",
        desc: "This code captures references to how the wider public views or understands the use of AI in policing and the criminal justice system.",
        quotes: [
          `"at the moment I don't think the public are agitated or overly concerned" (Interview 5)`,
          `"The public think that's happening [predictive policing] more than it is." (Interview 19)`,
          `"You say AI to [the] general public and it's, you know, they're going to take over our jobs type of thing." (Interview 22)`,
          `“One of the issues I’ve always had with policing is we police at people rather than with people and rather than bringing people on a journey…so lots of things I work on is trying to improve the public perception and bring confidence up throughout policing [using innovative ways]” (Interview 6)`,
          `“The public perception of policing using AI is not really fully understood… Within the UK the public have a general distrust of public sector and IT, and people are very concerned and I think with good cause, around their personal data and what the government and particularly law enforcement are doing with personal data. But the only time that we don't have a problem with our personal data and the State having detailed access to it is in the health sector where you'll tell your doctor virtually everything” (Interview 20)`,
          `“If somebody turned around and said Donald Trump is behind one of these, or Elon Musk, there will be parts of the population who say well I will never trust that” (Interview 25)`,
        ],
      },
    ],
  },
  {
    id: "t3",
    theme: "Challenges, Risks and Unintended Consequences of AI Deployment",
    themeDesc:
      "This theme captures information about the barriers, difficulties, and constraints that organisations and professionals encounter when implementing or integrating AI tools.",
    codes: [
      {
        id: "c24",
        code: "Technical Limitations",
        desc: "This code captures challenges related to AI system performance, accuracy, reliability, or integration with existing infrastructure. It includes limitations in speech recognition, interoperability with force systems, and technical constraints that affect deployment.",
        quotes: [
          `"The first and biggest challenge at the moment is that the [COPPA] AI library as we call it is static, so you have to manually update it" (Interview 12)`,
          `"Actually the automatic speech recognition technology within OpenAI, et cetera just isn't sophisticated enough to deal with the noisy environments that they're being deployed in" (Interview 19)`,
          `"The technical limitations with Copilot for now [are] that it can't feed into all these other systems outside of M365." (Interview 21)`,
          `“one of our challenges here…is that the technology is moving at a breathtaking pace and it’s really difficult for us to keep up” (Interview 5)`,
          `“…in relation to say digital forensics and the hiding of evidence…at the moment if we go and seize a device from someone then the evidence may include, for example, their Google search history, the things that have been saved on their device, whereas if they have been filtering things through a language model there may not be an immediately obvious way to recover that history. That data may be stored temporarily on a server somewhere…but there’s already this shift in how we access that information” (Interview 13)`,
          `“Road names, the spelling of road names is a particular challenge… The spelling of proper names, again unless it's actually spelt out can be a challenge [for the AI post-call analysis tool]…Under the Welsh Language Act for the four forces in Wales I'm required to provide exactly the same capability in Welsh. There ain't many LLMs that do Welsh, unfortunately” (Interview 20)`,
        ],
      },
      {
        id: "c25",
        code: "Pace of development and fragmented rollout",
        desc: "This code captures concerns about a fragmented and inefficient rollout of AI without sufficient guidance, and the rapid pace of technological change outpacing governance and evaluation capacity.",
        quotes: [
          `"one of our challenges here…is that the technology is moving at a breathtaking pace and it's really difficult for us to keep up" (Interview 5)`,
          `"What I think is the reality is, is that there’ll be a lot of disparate pieces of work. There’ll be a lot of duplication. There won’t be a coordinated approach to it" (Interview 9)`,
          `"[Because of the local 43 force model and slow national programs], we’ll get there but it will be in a bit of a messy fashion rather than in a clear well thought-out, well-planned way" (Interview 9)`,
          `"[Tools used by police forces are] so fragmented its bonkers" (Interview 11)`,
          `"The parameters are changing all of the time. Where the data's located is changing all of the time and it's such a race between the big technology companies that I don't think they're always keeping everybody up to date" (Interview 21)`,
          `"I'm pretty worried about the scale and the pace of [AI deployment] happening too quickly without regulatory frameworks" (Interview 23)`,
          `“what’s happening in terms of that provenance of the evidence, we would still want to see a transcription and we still want to see the audio. Yes, it might be the officer’s statement and the witness statement who have both signed it but the AI is ultimately the tool that was writing it” (Interview 2)`,
          `“You’ve got to understand what the risk of the tool getting it wrong is. You’ve got to understand what your expectation is going in and then as to whether you trust the answer the tool gives you…if you compare the risks of using the AI with risks of using a human you have a slight question of how different really are they... In the Vigil [AI] case there are risks, definitely mostly around false negatives rather than false positives, but I don’t think they’re wildly different from what you’d have with human operators” (Interview 16)`,
          `“These classic issues which have been around for a while, these concerns about over trust and under trust of automated systems…[Imagine] someone having low self-esteem because they’ve just had a run of cases that they’ve lost or they’ve just been told off by their manager and they’re feeling a bit like oh God, I can’t get anything right, I don’t trust my own judgement and then they’re told to go and be an effective human overseer in a windowless room somewhere and the computer tells them something and they go yeah, I must be wrong (Interview 17)`,
          `“At the moment we say they cannot use it [Copilot] with case work because we don't know. It's not necessarily that we don't think it's secure in our estate, it's what prompts they put in and whether they would be reliant on those prompts, and we know there is hallucinations… We're not sure people are trained enough to use the prompts to ask the right questions to get the right results” (Interview 18)`,
          `“The research that is involved in... from Sciencewise and then recent research from Sentric do indicate that any probabilistic prediction forecasting place or person are the highest concerned, person significantly more, place less so” (Interview 19)`,
          `“We've had some really positive comments from users who've never been anywhere near this kind of [technology who] said this is really good because I can understand it… [But] I'm very nervous around sentiment analysis for various reasons and its use in policing because I'm always told that sentiment analytics is capable of detecting… seventeen different human emotions… I'm worried that an AI tool could hallucinate on sentiment analysis if it's only hearing conversations that are of negative sentiment” (Interview 20)`,
          `“Once you have confidence in [the output of] that [AI] system that QA process can't just disappear because now you've got confidence in the AI… tool, you still have to have that level of QA in there” (Interview 22)`,
          `“It depends who's promoting it. If Paul Greaney KC… says I've spent a lot of time looking at this, I've spoken to people about it, I consider it to be reliable, then a lot of people will say well if it's good enough for Paul it's good enough for me” (Interview 25)`,
        ],
      },
      {
        id: "c26",
        code: "Unused Materials and Disclosure Issues",
        desc: "This code captures challenges related to managing, retaining, and disclosing materials that are not actively used in investigations or prosecutions, including AI-generated transcripts and summaries that create additional disclosure obligations.",
        quotes: [
          `"What using AI has done is generate more unused material, so you've got the audio, the conversation is being recorded, that's unused material." (Interview 2)`,
          `"There is a legal obligation on CPS to review both [the summary and the full transcription] and then there is a legal obligation on CPS to disclose both to the defence potentially" (Interview 21)`,
          `“[Concerning disclosure of AI metadata], if we do and it creates evidential gaps, and the us more work that’s going to be an issue but we’re not going to implications of AI-assisted lose a criminal investigation. I think for at least a while we should filtering or prioritisation on what be disclosing it” (Interview 9)`,
        ],
      },
      {
        id: "c27",
        code: "Evidential chain risks and legalities",
        desc: "This code captures potential risks, challenges, or legal considerations associated with the handling, transfer, and use of evidence processed or generated by AI systems, including admissibility, disclosure obligations, and the integrity of the evidential chain.",
        quotes: [
          `"I would have said don't use AI and anything that's in the evidential chain" (Interview 9)`,
          `"[On the RVR AI trial], we had to pause our trial and engage with CPS…[The lesson learned was that] we should have engaged with CPS sooner" (Interview 9)`,
          `“[The] prosecution team... [must] identify the reliability of their statutory requirements within evidence and what other confirmatory or corroborative evidence the criminal justice system. is there that support the material that they’re relying on…[It's the role of] prosecution authorities and law enforcement to try and identify whether the evidence they rely on it is reliable and credible rather than just saying we’ll just leave it up to the jury” (Interview 10)`,
          `“As we integrate probabilistic systems, systems which can essentially infiltrate opinion and probabilistic values into computer evidence, we need to start thinking about how just as you can challenge the reliability of a witness by cross examining them, what the correlative of that is in relation to computer evidence” (Interview 17)`,
          `“In some countries… crime linkage analysis has been presented as evidence in court. Some other countries as well there have been attempts to present it in court but it's been rejected and from our point of view, certainly at the moment, we wouldn't see it as being something that an expert would stand up in court and say we used this [AI] tool, this is how it informed the decision making… I don't really think they like doing that, and I don't think that any time soon there's a likelihood that someone's going to be stood up in court having used this tool” (Interview 23)`,
        ],
      },
      {
        id: "c28",
        code: "Data Quality and Availability",
        desc: "This code captures difficulties arising from incomplete, biased, or inaccessible datasets necessary for AI training and operation, including the risk that policing data reflects existing biases.",
        quotes: [
          `"the challenge sometimes is around our availability of data and what we will share and what we won't share and also if we're using our datasets the bias that's already in there around our policing dataset" (Interview 8)`,
          `"What is also hugely problematic…is data quality" (Interview 7)`,
          `“Actually it's not hugely difficult to use machine learning with the data that we have, albeit our data's a bit messy, but if you clean it a bit to be able to identify your [targets using] fairly high precision and recall algorithms” (Interview 19)`,
          `“I remember in my… school exams on school computer science… the old adage if you put garbage in you'll get garbage out. So, I think there's a real challenge with some of the data quality that we potentially could be facing… [At] the very first stage of the processing… the transcription [carried out by the AI post-analysis tool] from the audio to a usable digital format, we wanted to really understand… whereabouts might impurity into the processing of that data start to appear” (Interview 20)`,
          `“[There is] too much risk of duplication in there which obviously impacts our data protection compliance and processes, and the risk that the corporate record which has to be preserved, not only for the length of a case but also afterwards and sometimes long beyond for cases of historical or real prominence… if we break that whole process that's been there for generations and generations because we used Copilot is not good” (Interview 21)`,
        ],
      },
      {
        id: "c29",
        code: "Skills gap and understanding deficiencies",
        desc: "This code captures constraints related to staffing, skills, training, expertise, or institutional readiness to implement AI effectively, including gaps in technical knowledge among officers and senior leadership.",
        quotes: [
          `"The biggest thing overall from an AI space, but this is broader in the digital element anyway, is skills and the lack of knowledge" (Interview 8)`,
          `"The vast majority of senior police officers have very little technical knowledge when it comes to technology or AI" (Interview 5)`,
          `"People have inflated ideas of what AI is... and it feels like a recipe for automation bias" (Interview 13)`,
          `“If you know how to direct a conversation to look at the salient points to prove …you’re looking at how you’re going to gather that best evidence. There needs to be that level of understanding there, definitely, or else the system is only going to be as good as what the conversation is” (Interview 2)`,
          `“[the main challenge is] about interpreting the output of these [AI] tools, understanding what isn’t is inaccurate, making sure there are appropriate governance arrangements in place to check accuracy and that requires training at a leadership level but also user level as well, and there is no national appropriate to that at the moment” (Interview 3)`,
          `“there’s huge variation... in terms of people’s understanding of everything to do with AI really, everything from the real detail... but even having a buyer beware type level of understanding” (Interview 7)`,
          `“we’re being led by suppliers and by evaluations that are being done by policing which up until now the vigorous nature of them may have been adequate but for AI the risk that it’s being confused, if we have got people that are not aware of how our AI can work and that it needs to be transparent” (Interview 9)`,
          `“[The risk is] that the system is tilted in favour of evidence that the defence find difficult to challenge because they don’t have the tools or the knowledge because they haven’t had the training, or the awareness” (Interview 10)`,
          `“we’re finding a lot of people are used to using software x to do y and so spending some time with them to show them the benefits... It’s been a big learning on the policing side so we’re having to invest a lot more time on one-to-one sessions” (Interview 14)`,
          `“We probably think as lawyers that we’re really quite good at using natural language and giving clear instructions. I have found since using Gen AI that perhaps I have not been giving good instructions for the last twenty years because the Gen AI seems to repeatedly find ways of misinterpreting what I’m telling it” (Interview 15)`,
          `“Maybe I'm not giving it [Copilot] the right prompt. Maybe that's part of the learning thing for me… A lot of people get confused around automation and AI and I'm still trying to get my head around that as well” (Interview 18)`,
          `“[It] requires some specific expertise... requires the infrastructure to do it and forces generally haven't built Python environments within their environments, Azure or whatever, and generally need a partner to come in and help them with that because it's more complicated than you would think” (Interview 19)`,
          `“I think one of the challenges we have in policing… [is] literacy and understanding of both data and… AI capability… I think there's a real human capability… challenge to understand where AI genuinely might add value” (Interview 20)`,
          `“The risks are user risks rather than technical risks… it's making sure our staff are mature enough to understand what they're using it for, mature enough to understand the limitations of the system, what it can't do” (Interview 21)`,
          `“We don't have a high turnover of staff in Forensic Services so most people, like I've been in forensics for thirty years, most people are in that space… so their use of technology et cetera is very much not in the current space… We have a lot of challenges with people just getting to use systems so I think there would be that… nervousness and the uncertainty and the unknown” (Interview 24)`,
        ],
      },
      {
        id: "c_need_diverse_expertise",
        code: "Need for diverse expertise",
        desc: "This code captures references to the requirement for a range of skills, knowledge, and professional backgrounds to effectively develop, implement, and oversee AI systems. It includes the involvement of technical experts, legal and ethical advisors, operational practitioners, and other stakeholders to ensure balanced, responsible AI deployment.",
        quotes: [
          `"you might have one person who's supposed to be the technical expert, but that's never going to be enough because…there are several different types of technologists...you have to be really careful and at the moment policing is just starting to get to understand that all of those things are different and you cannot just have one representative" (Interview 7)`,
          `"I'm not a computer scientist. I don't have that ability to be able to understand and interpret those terms" (Interview 9)`,
          `"In our world one of the areas is how do you train that tool. We don't have the skills and expertise to train that tool. We're going to have to rely on other people and so we've got to make sure that those other people are doing it right and we're not just buying something off the shelf that's been trained on everything or trained on something completely different" (Interview 8)`,
          `"I think one of the challenges we have in policing… [is] literacy and understanding of both data and… AI capability… I think there's a real human capability… challenge to understand where AI genuinely might add value" (Interview 20)`,
          `"The risks are user risks rather than technical risks… it's making sure our staff are mature enough to understand what they're using it for, mature enough to understand the limitations of the system, what it can't do" (Interview 21)`,
          `“In our world one of the areas is how do you train that tool. We don't have the skills and expertise to train that tool. We're accountable, and effective AI providing the data and you're relying on other external skills and use. expertise to train that tool and give it the right prompts” (Interview 24)`,
        ],
      },
      {
        id: "c_methodological_challenges",
        code: "Methodological challenges",
        desc: "This code captures references to methodological, statistical, or interpretive concerns about AI systems used in policing. It includes issues around model interpretability, spurious correlations, overfitting, and the challenge of applying probabilistic AI outputs in operational or legal contexts.",
        quotes: [
          `"You need to start with a theory and then test it against, test it with evidence rather than the other way around" (Interview 25)`,
          `"having some language to explain a more controlled and constrained application of AI where the results are more binary... versus something where you could ask it anything and it would give you any answer" (Interview 14)`,
          `"[The use of probabilistic AI raises concerns about] interpretability, and the risk of spurious correlations or overfitting in probabilistic and predictive AI systems" (Interview 17)`,
          `"I always treated the… DNA finding… as probabilistic and what you do is you say OK ladies and gentlemen of the jury, those are pretty good odds that it's the defendant and then you draw additional evidence… We don't have very much that's actually determinative" (Interview 25)`,
          `“one of our challenges here…is that the technology is moving at a breathtaking pace and it’s really difficult for us to keep up” (Interview 5)`,
          `“…in relation to say digital forensics and the hiding of evidence…at the moment if we go and seize a device from someone then the evidence may include, for example, their Google search history, the things that have been saved on their device, whereas if they have been filtering things through a language model there may not be an immediately obvious way to recover that history. That data may be stored temporarily on a server somewhere…but there’s already this shift in how we access that information” (Interview 13)`,
          `“Road names, the spelling of road names is a particular challenge… The spelling of proper names, again unless it's actually spelt out can be a challenge [for the AI post-call analysis tool]…Under the Welsh Language Act for the four forces in Wales I'm required to provide exactly the same capability in Welsh. There ain't many LLMs that do Welsh, unfortunately” (Interview 20)`,
        ],
      },
      {
        id: "c_informal_ai",
        code: "Informal AI use by officers",
        desc: "This code captures references to ad hoc, unofficial, or self-directed AI use by staff, including reliance on personal experimentation or external tools outside formal organisational processes.",
        quotes: [
          `"there has been no chambers training for anybody in the use of AI. Anybody who is interested in it is doing their own research" (Interview 10)`,
          `"We also know that people are…trying to use…ChatGPT but we don't know what they're using it for" (Interview 18)`,
          `"If they've used any of those [LLM] tools, they will have used them offline from work because they wouldn't be able to access them in work" (Interview 24)`,
          `“there’ll also be lots of informal use of it by individuals to help officers the ad hoc, unofficial, or them…It’s trying now to quickly make sure that officers are unsanctioned use of AI tools by supported to understand the implications or even using officers in their day-to-day work. something like ChatGPT for themselves because they need to It includes instances where AI is understand that they can only use it for in very specific contexts” employed outside formal (Interview 7)`,
          `“[We are looking at] compliance tooling to help us monitor… we can see the prompts people are putting in… to monitor compliance with policy, but [also] to identify… everybody's skipping this tool and going straight to ChatGPT… so shadow AI, that kind of thing” (Interview 21)`,
        ],
      },
      {
        id: "c_lack_accountability",
        code: "Lack of individual accountability",
        desc: "This code captures information about the risk that individuals defer responsibility to AI systems without sufficient understanding or ownership of the resulting outputs or decisions.",
        quotes: [
          `"It would be too easy for [officers] now to say not my fault, the AI said, to make that decision, so I did what the AI said" (Interview 9)`,
          `"Fundamentally, a lawyer should not be relying on material that they have [no] thorough understanding of themselves" (Interview 10)`,
          `"You can't just put something in and expect it to be right... you have to take responsibility for your own output" (Interview 21)`,
          `“One barrister really got herself into hot water because she doubled down on the hallucination and she said no, no, these are genuine cases and should have just owned up and said I'm sorry, yes, this is what I did” (Interview 25)`,
        ],
      },
      {
        id: "c30",
        code: "Over-reliance / de-skilling and atrophy of decision-making skills",
        desc: "This code captures information about the dangers of overreliance on AI outputs which could lead to de-skilling, atrophy of decision-making skills, and reduced personal responsibility for judgments and actions.",
        quotes: [
          `"overreliance on this technology will cause atrophy in skills that would otherwise have been used" (Interview 3)`,
          `"ultimately what we don't want is further down the line to completely deskill a workforce" (Interview 2)`,
          `"We refer to [it] as deskilling, so that goes back to almost that business continuity thing" (Interview 18)`,
          `"It would be too easy for [officers] now to say not my fault, the AI said, to make that decision, so I did what the AI said" (Interview 9)`,
          `"A human responsibility has to exist. [As a supervisor], it’s my head on the block in the courtroom and I need to understand [the AI] in that level of detail" (Interview 10)`,
        ],
      },
      {
        id: "c_public_trust",
        code: "Public Trust",
        desc: "This code captures references to the effect of AI deployment on confidence, legitimacy, and trust among the public and justice-system stakeholders.",
        quotes: [
          `"at the moment I don't think the public are agitated or overly concerned" (Interview 5)`,
          `"It's really important that we are open and transparent with the use of AI tools… making sure that… everybody within the criminal justice system is aware of the use of AI" (Interview 22)`,
          `"[Referring to the Horizon Post-Office scandal] We tend to put the blame on the software, but often we forget that there was a disclosure disaster there with the state-owned company knowing about the problems" (Interview 25)`,
          `“We need to have some greater public dialogue around the harms that we're looking to prevent, what it means and then one of the things that I talk about an awful lot is relentlessly talk about it with our communities” (Interview 19)`,
        ],
      },
      {
        id: "c31",
        code: "Legal and regulatory barriers",
        desc: "This code captures challenges associated with compliance, compatibility, data access and retention, accountability, and navigating existing laws when deploying AI in policing and the criminal justice system.",
        quotes: [
          `"There's definitely some challenges in terms of the way that artificial intelligence as a technology works and its compatibility with UK law" (Interview 11)`,
          `"The ultimate issue rule… an expert is not permitted to answer the ultimate issue in the case because that's for the jury to decide" (Interview 25)`,
          `“we’ve got to go through the privacy review, we’ve got to go through the infosec review... One of the big problems is we don’t want our data processed in the US... so we had to wait a while for them to be moved to data centres in the UK” (Interview 15)`,
          `“Let’s face it, it’s rooted in the English legal system. Underneath it all it’s a really challenging thing to say we’ve done stuff based on this slightly non-deterministic tool... I think we’ve got a long way to go with that for these kind of tools... because you’re up against a system that starts from the point of view of both…determinism and cross examination” (Interview 16)`,
          `“We draw attention to the risk of unforeseeability around their being problems at legal clarity with the current patchwork legal framework that we have for deployment of some of these tools…there needs to be some kind of regulatory coherence and someone looking at it through a policing perspective and identifying gaps” (Interview 17)`,
          `“If it's law enforcement, are there any legal implications of it? If it's regular general data protection regulations for GDPR, are we ensuring we're meeting all of the principles under GDPR and the Data Protection Act?… There's also the criminal procedure rules as well and we have to make sure that they are fully followed” (Interview 21)`,
        ],
      },
      {
        id: "c32",
        code: "Ethical and social concerns",
        desc: "This code captures apprehensions regarding fairness, bias, transparency, and privacy associated with the use of AI in policing and the criminal justice system, including concerns about discriminatory outcomes and erosion of civil liberties.",
        quotes: [
          `"in respect of the data that we've got on our systems…individuals …need to understand the bias that could be employed within our environment" (Interview 8)`,
          `"We all need to remember why we are there and we're doing all of this not to save ourselves time and to be efficient but to get justice for members of the public" (Interview 21)`,
          `“Any AI we’re going through the covenant and the AI checklist to ensure that those guidelines are in place before we look at anything in terms of AI” (Interview 2)`,
          `“The extent to which people have the facilities to challenge the case against them, I think, is an area of concern when it comes to the extent to which people can understand the influence of probabilistic systems in investigations which have led to their prosecution” (Interview 17)`,
          `“There's a different risk appetite with people versus place for the right reasons, people's very specific and individual and also the likely calculation of race, sex, gender et cetera, age, actually then... you are classifying risk based on personal characteristics” (Interview 19)`,
          `“Quite rightly and quite understandably there are many people that say that police data is inherently biased… If we don't illuminate [accuracy concerns] and we just assume the transcription is accurate, then potentially everything else could become biased that follows” (Interview 20)`,
          `“There is the bias element within AI language tools and we need to be really careful… conscious of bias and potential… discrimination… The impact on victim and witnesses within the criminal justice space in particular is really important… At the end of the day… the reason why we do what we do is for the victim and witnesses” (Interview 22)`,
        ],
      },
      {
        id: "c33",
        code: "Accuracy and reliability",
        desc: "This code captures the correctness, precision, and dependability of AI outputs or predictions, including issues of hallucination, inconsistency, and the risk of acting on inaccurate AI-generated information.",
        quotes: [
          `"there's still a lot of work to do…particularly around levels of model accuracy that constitute good enough within a policing context" (Interview 3)`,
          `"We're using Copilot within the Home Office and…it shows a lot of the problems around irresponsible use, because it's often hallucinating rubbish" (Interview 3)`,
          `"When it comes to legal research tools my training says assume it's wrong." (Interview 15)`,
          `"We know there is hallucinations. So, for now we say you can use Copilot but you cannot use it with casework" (Interview 18)`,
          `“AI functionality behind that [Maltego Monitor] will look at all of Reliability the correctness, precision, and the posts and it will do a sentiment analysis based on the posts. dependability of AI outputs or It’s not perfect because if someone posts that’s a really good predictions. It includes murder, that will be a positive post whereas it’s obviously a discussions of performance negative one”. (Interview 1)`,
          `“What we don’t want is a victim to give us their words in terms over time, and users’ confidence of what happens and then a really intelligent AI system create in the system to produce valid this statement that William Shakespeare could have written, and and repeatable results. it’s not in the victim’s voice, it’s not said the words the victim said and is completely flowered up in this magical nuanced version of events” (Interview 2)`,
          `“I’ve tried to use [AI] myself and I’ve come across a number of examples where in trying to be heroically helpful they have told me something that was not the case” (Interview 7)`,
          `“people assume that the current processes are consistent and accurate and the only thing that we found consistently is that they’re not…” (Interview 13)`,
          `“[The AI post-call analysis tool] thought that fly tipping was categorised as animal abuse. So, we had to go back in and prompt engineer it and say no, it's not animal abuse, this is an environmental crime… [It was also] nuanced enough to say [it was] unable to differentiate between whether the violence against the person is immediate or whether it's a threat of something in the future… [And] Gleneagles Road versus Gleneagles Drive, or Gleneagle single, they could be really important” (Interview 20)`,
          `“The CPS loves an acronym and I have to remember to take the acronyms out or spell out the acronyms in Copilot first time because it's produced me three pages on something that never existed because I used an acronym… But it says it with such authority, doesn't it, that you just [think] this thing must exist. No, it doesn't… [Also] sometimes [it misses] actions in meetings… If I've got ten written down and it only produces eight” (Interview 21)`,
          `“Some of the risks that we found with it is the hallucinations within large language models and embellishments as well… If you had an account of… the individual grabbed a bottle of whiskey and shoved it in their coat pocket… But actually the AI generated transcript identified it as… the bottle of whiskey was picked up from the shelf and placed in the basket… There is a real difference there… if you're wanting to prove an offence” (Interview 22)`,
        ],
      },
      {
        id: "c34",
        code: "'Black box' problem",
        desc: "This code captures the opacity of AI systems, where the internal logic, decision-making processes, or predictive mechanisms are not easily understandable or interpretable by users, raising concerns about accountability and trust.",
        quotes: [
          `"one of the challenges [is] that as [AI] becomes more complicated, we understand it less" (Interview 5)`,
          `"There's a risk around black box, so things being shown to forces that look very, very attractive but where you can't actually see what the code is" (Interview 7)`,
          `"I've never been able to find out of these commercial vendors what their LLMs have been trained on. Very, very opaque" (Interview 20)`,
          `“we’re no longer for the most part buying proprietary software” trust. (Interview 13)`,
          `“you’re up against a system that starts from the point of view of... determinism and cross examination... If it comes to an evidential case...I can put someone on the stand and cross examine them about how the tool works and you have that challenge of an AI model of someone stands up there and says we ran the tool and it said this happened and the defence say explain to me how it works. Well, you multiply some matrices together and that was the answer. It’s really difficult” (Interview 16)`,
          `“There’s an argument, especially with unexplainable models used within summarisation and transcription that you don’t need those models to be explainable because you have that independent source of verification [the original audio or text]” (Interview 17)`,
          `“This is one of the things that we're trying and failing to talk to tech companies about... they don't let you know what they're using and so actually your ability to then understand and compare apples with apples if you're making a commercial decision or if you're even just making a decision about the use of it, you don't really know what is happening, which is a worry” (Interview 19)`,
        ],
      },
      {
        id: "c_change_resistance",
        code: "Change Management and Adoption Resistance",
        desc: "This code captures organisational or individual resistance to adopting AI, including cultural barriers, scepticism, or lack of stakeholder buy-in.",
        quotes: [
          `"One of the biggest ones to start with was getting the teams to actually use it" (Interview 14)`,
          `"There are definitely some engrained ways of working where specific tasks have to be passed to very specific teams to complete them" (Interview 14)`,
          `"We have come up against a few who have said absolutely I'm not interested, I don't want to do that, can I opt out" (Interview 18)`,
        ],
      },
      {
        id: "c_procurement_challenges",
        code: "Procurement Challenges",
        desc: "This code captures challenges arising from duplicative procurement of similar AI tools across forces, as well as rigidity, red tape, and fragmented purchasing processes.",
        quotes: [
          `"policing buys their own things and doesn’t tell anyone... this ridiculous situation where 43 forces all procure their own uniform and their own cars and their own technology" (Interview 3)`,
          `"public sector procurement is so rigid and so tight that it does take a lot of flexibility out" (Interview 6)`,
          `"Everything else right now is pretty much individual forces... procuring a tool under the guidance of the playbook" (Interview 19)`,
          `“one of our challenges here…is that the technology is moving at a breathtaking pace and it’s really difficult for us to keep up” (Interview 5)`,
          `“…in relation to say digital forensics and the hiding of evidence…at the moment if we go and seize a device from someone then the evidence may include, for example, their Google search history, the things that have been saved on their device, whereas if they have been filtering things through a language model there may not be an immediately obvious way to recover that history. That data may be stored temporarily on a server somewhere…but there’s already this shift in how we access that information” (Interview 13)`,
          `“Road names, the spelling of road names is a particular challenge… The spelling of proper names, again unless it's actually spelt out can be a challenge [for the AI post-call analysis tool]…Under the Welsh Language Act for the four forces in Wales I'm required to provide exactly the same capability in Welsh. There ain't many LLMs that do Welsh, unfortunately” (Interview 20)`,
        ],
      },
      {
        id: "c_commercial_partner",
        code: "Commercial Partner Challenges",
        desc: "This code captures challenges of being contractually bound to suppliers, including lock-in, long contract terms, and limited flexibility when pilots or proof-of-concept work does not deliver value.",
        quotes: [
          `"I can’t at the end of my trial say that didn’t work, I’m not going to use that now because I’m now locked into a contract" (Interview 6)`,
          `"Some will be commercially bound because they’re already invested in doing some other changes in their organisation and now they’re going to do this bit" (Interview 8)`,
        ],
      },
      {
        id: "c_vendor_snake_oil",
        code: "Vendor 'snake oil' solutions",
        desc: "This code captures references to AI products or services offered by vendors that are perceived as overhyped, misleading, or failing to deliver promised functionality.",
        quotes: [
          `"it’s telling the difference between things that are really genuinely innovative and useful to policing and things that are a rebranding of ChatGPT with some fancy stuff over the top" (Interview 7)`,
          `"it’s very difficult to be a clever, a smart buyer, because every vendor is coming to you and saying that their tools are AI enabled" (Interview 13)`,
          `"I've been sold or tried to be sold so many things that quite clearly aren't AI but because it’s just an easy, lazy term" (Interview 20)`,
          `“People think Axon are doing AI. No they’re not. What they're doing is they're just using a foundation model and repurposing it, probably not even fine tuning it in any shape or form and just putting it in their text DAC. Same with Palantir, Palantir are an AI company. No, they're not. They are a company that repurposes AI to enable analysis of big data…but they’re not even, I don’t think they’re even fine tuning anything or doing anything specifically interesting” (Interview 19)`,
        ],
      },
      {
        id: "c_supplier_timeline",
        code: "Supplier-driven timeline",
        desc: "This code captures references to project schedules or implementation timings being driven primarily by suppliers rather than internal readiness or planning.",
        quotes: [
          `"it’s in their interest [suppliers’] to push hard and fast on it and sometimes it’s the only way forces can get delivery of technology is to work to a supplier’s timeline" (Interview 9)`,
          `"At the moment it is very much policing being done…by technology companies than the other way around" (Interview 19)`,
        ],
      },
      {
        id: "c_historical_structures",
        code: "Historical structural issues",
        desc: "This code captures longstanding organisational, institutional, or systemic structures that constrain AI adoption, interoperability, or effective coordination.",
        quotes: [
          `"This is a fundamental consequence of the 43 force model which is a hangover from the fact that this model was invented before computers" (Interview 3)`,
          `"AI lead[s] [do] not know about the AI tool that is in the force, because it was not brought in under the technology or digital banner" (Interview 11)`,
          `"Everyone likes to have their own kingdom in policing" (Interview 12)`,
          `“[I] have fought quite strongly against the notion of…doing technology to people without bringing them along on the journey which is sort of what we do in policing…and why things fail” (Interview 19)`,
        ],
      },
      {
        id: "c_eval_cost",
        code: "Evaluation Cost/Impact",
        desc: "This code captures the high financial and operational cost of evaluating AI tools before deployment, as well as the possibility that evaluation findings may slow, limit, or halt rollout.",
        quotes: [
          `"[The academic evaluation] was quite expensive. My entire budget for the programme, the academic study probably took nearly thirty per cent of that budget" (Interview 6)`,
          `"right now having just seen the draft academic report, it may actually prohibit me moving into a phase three" (Interview 6)`,
          `"the funding pot... might not have enough funding for evaluation" (Interview 8)`,
          `“It all depends on resource and money and things, but if we can find the money to do that then we will want to do that so that we can understand… how the humans are interacting with the [LATIS] tool” (Interview 23)`,
        ],
      },
      {
        id: "c_cost_access",
        code: "Cost and accessibility",
        desc: "This code captures financial and practical factors affecting the adoption, deployment, and accessibility of AI tools.",
        quotes: [
          `"The prohibitive cost of technology in AI [makes a free proof of concept] really attractive" (Interview 9)`,
          `"with AI there’s some challenges around affordability [post-proof-of-concept]" (Interview 9)`,
          `"This stuff is not free and therefore that is a barrier to adoption at a[n] organisational level for all organisations" (Interview 15)`,
          `“Collaboraite [needs special] licences to have it, so its like financial and practical factors additional functionality that you’ve got to pay for…but with the affecting the adoption, public purse the way it is I think the smaller forces may struggle to deployment, and use of AI systems. buy the specialist software” (Interview 1)`,
          `“we want to know where the best place to process our data and constraints, procurement we’re worried about the costs because it costs money to move expenses, resource availability, data, process it, store it, share it. Everything you do with data costs affordability, and the ease or money in reality and the use of an AI is still very much unknown to difficulty for organisations or us. Part of the process is to understand on a very small scale what personnel to access and utilise AI the compute cost would actually be, what’s the data, do we tools effectively. achieve the outcomes we want, what’s the cost of it, what’s the risks of doing so” (Interview 5)`,
          `“[AI systems] cost money” (Interview 10)`,
        ],
      },
      {
        id: "c_resp_diffusion",
        code: "Responsibility Diffusion",
        desc: "This code captures references to the spreading or unclear allocation of accountability when AI systems are used in decision-making.",
        quotes: [
          `"If you’re expecting police officers to be computer scientists then your system will fail" (Interview 17)`,
          `"the [burden of] responsibility needs to be spread with mandatory quality assurance systems upstream and ongoing monitoring and evaluations downstream" (Interview 17)`,
        ],
      },
      {
        id: "c_talent_retention",
        code: "Talent retention",
        desc: "This code captures challenges related to retaining skilled personnel needed to build, govern, and operate AI systems in the public sector.",
        quotes: [
          `"we are haemorrhaging the really talented people because they’re going off to the organisations like your Googles and your Amazons" (Interview 5)`,
          `"once you [upskill officers]…,they'll leave the public sector because they don't pay enough" (Interview 9)`,
        ],
      },
      {
        id: "c_test_data_creation",
        code: "Test-data creation",
        desc: "This code captures references to the generation, preparation, or curation of datasets used to train, validate, or evaluate AI systems.",
        quotes: [
          `"test data is a challenge for us. We have huge volumes of data but of course it’s all live real data" (Interview 5)`,
          `"real scenarios, real data and some synthetic data" (Interview 19)`,
          `“The development testing [for Vigil AI] was done very closely with concerns associated with the Home Office because that was the only way to because it’s producing reliable and safe test their data…[and] It’s illegal to possess [CSAM], so if we can do it data. with those, that’s the only way anyone can actually work with the stuff” (Interview 16)`,
        ],
      },
      {
        id: "c_data_limits_predictive",
        code: "Data limitations for probabilistic/predictive AI",
        desc: "This code captures constraints or shortcomings in the datasets used to develop, train, or operate probabilistic or predictive AI systems.",
        quotes: [
          `"there’s an issue for any probabilistic use which relies on only police data because police data by its nature is only that which is connected to the criminal justice processes" (Interview 7)`,
        ],
      },
      {
        id: "c_data_time_pressure",
        code: "Data training and time pressure",
        desc: "This code captures information about the volume of data required to make AI systems useful and the time pressure involved in preparing that data.",
        quotes: [
          `"We started off with six weeks’ worth of data. It clearly was useless... and I think we ended up putting something close to four- or five-years’ worth of data through [the AI system]" (Interview 6)`,
          `"if you want to automate a document... you probably need a hundred examples and then someone’s got to go through and label everything up and that takes time" (Interview 15)`,
          `“there definitely seems to be a need for more open tools for discovery, search and investigation in the earlier stages to actually be able to locate things in huge datasets before you then extract the bits you need and then put them through the forensic process” (Interview 14)`,
        ],
      },
      {
        id: "c_time_delay",
        code: "Time delay",
        desc: "This code captures the substantial time difference between implementing or testing AI in the private sector versus the public sector.",
        quotes: [
          `"Something I would have probably done in the private sector with a couple of conversations maybe within a week I could get going here in the public service will take me three to six months before I can even start to try something" (Interview 6)`,
        ],
      },
      {
        id: "c_speed_vs_eval",
        code: "Speed of deployment vs. planning and evaluation",
        desc: "This code captures concerns that the push for AI adoption can bypass necessary planning, governance, and evaluation phases.",
        quotes: [
          `"the speed at which that [the RVR AI trial] stood up was really quick. So, the time to plan things and to look to get evaluations it wasn’t there" (Interview 9)`,
          `"There is the government direction to use AI and there's a bit of a panic with we have to use it" (Interview 21)`,
          `“It [an AI winter] might give... us the break that we need to catch up, because I think everything's sprinting along far too fast…To give us that moment in time to say let's make sure what we're doing is all correct again and have that full overview before we start again” (Interview 18)`,
        ],
      },
      {
        id: "c_supplier_dilemma",
        code: "Supplier’s dilemma regarding systemic change vs. narrow solutions",
        desc: "This code captures the strategic decision by technology providers to bypass broad systemic resistance by pursuing narrow, point-solution use cases instead.",
        quotes: [
          `"there are cases where we think it would be harder to get adoption or buy in... are we going to wait for identifying use cases where we can do really, really narrow point solutions" (Interview 16)`,
        ],
      },
      {
        id: "c_dehumanisation",
        code: "Dehumanisation and datafication",
        desc: "This code captures the risk that data-driven AI systems reduce people to data points or statistical classes, undermining dignity and individualised decision-making.",
        quotes: [
          `"the police start treating people as data rather than people...a dehumanisation risk is a risk to the rule of law" (Interview 17)`,
        ],
      },
      {
        id: "c_cognitive_burden",
        code: "Cognitive burden redistribution",
        desc: "This code captures the risk that automating routine tasks concentrates staff effort on more complex work, potentially increasing fatigue and cognitive strain.",
        quotes: [
          `"that could go to I think a cognitive burnout where they're doing the big stuff and all the little stuff that they used to be able to span out the day" (Interview 18)`,
        ],
      },
      {
        id: "c_solutionising",
        code: "Solutionising culture in policing",
        desc: "This code captures an organisational tendency to adopt solutions before fully understanding the problem, risking premature or poorly targeted AI deployment.",
        quotes: [
          `"We're very good at solutionising… Anyone that is successful at selling into policing will know sell the solution first and then let them sort out what the problem was after you've sold it" (Interview 20)`,
        ],
      },
    ],
  },
  {
    id: "t4",
    theme: "Chaining",
    themeDesc:
      "This theme captures information about the interaction and interdependence of multiple AI systems, including how the outputs of one system can become the inputs of another, and the implications of these linked processes for accuracy, accountability, and governance.",
    codes: [
      {
        id: "c39",
        code: "System interdependencies",
        desc: "This code captures information about how different AI tools or systems are connected and how outputs from one system feed into or influence another, and the implications of these linked processes for policing workflows.",
        quotes: [
          `"I think [chaining is] very limited because a lot of these AI development is still fairly young and fairly embryonic" (Interview 5)`,
          `"I'm not aware of any [chaining of AI systems]...I think there's a lot of nervousness across forces about anything like that" (Interview 7)`,
          `"Not yet [has chaining occurred]. I think it's too early." (Interview 21)`,
          `“I don’t think we’re that far advanced yet [regarding one AI making implications of system providing input to another]…but it won’t be long…I’ve not these linked processes. heard of the [term] chaining before which gives you an indication that nobody had really put a thought into the implications that could be had around that” (Interview 9)`,
          `“we created an enhancement functionality where you would put in your request, that would then get enhanced by a language model with a prompt injection... and then that enhanced prompt would go into the generative model” (Interview 13)`,
          `“I can imagine some kind of agentic forensic tool that goes off and runs a bunch of tools and takes the output of those and feeds those through into other bits and makes decisions on that” (Interview 16)`,
          `“[Chaining can occur] if we’re thinking about disclosure as a safeguard to police AI but then disclosure itself is being conducted by AI… I think that [AI-assisted disclosure] is going to be0 a huge area as just the sheer amount of information that police and prosecutors have to go through” (Interview 17)`,
          `“I think it's probably quite rare that you would just have [a single process]... so if you look at... your transcription here, in theory if you have Teams Premium or Copilot Premium that would then just summarise and generate a summary at the end of it. Those are multiple different processes that go into it” (Interview 19)`,
          `“[Different LLMs are used] for different purposes… for each of those stages of processing we have very, very carefully and forensically looked at what's the accuracy level required, what's the speed required… [and] what is the data that is output from this stage of processing going to go on to be used for” (Interview 20)`,
          `“I'm not aware of anything at the moment, but I think we do need to be really aware of that because one AI tool could be used on a particular document… and then once it's submitted into either like a sharing platform or an interface, it might be that there are AI running in that particular organisation or on that particular document… the digital aspect of it… we need to be really alive to… we're not prohibiting later down the line potentially due to digital development” (Interview 22)`,
        ],
      },
      {
        id: "c40",
        code: "Compounding errors",
        desc: "This code captures information about how inaccuracies or biases in one AI system may propagate and amplify through linked AI systems, compounding errors throughout the processing chain.",
        quotes: [
          `"If we don't illuminate [transcription accuracy concerns] and we just assume the transcription is accurate, then potentially everything else could become biased that follows. That's why we're really concentrated on making sure that [the AI post-call analysis tool's] transcription accuracy figures are well understood" (Interview 20)`,
          `"That would be like AI training AI and not having a bedrock of data sufficiently wide enough to train the first tool. Is that not just kind of doubling your risk there?… If you use the output of AI to train another AI tool I'm imaging that would be in a slightly different but linked context but with similar issues to accuracy" (Interview 24)`,
        ],
      },
      {
        id: "c_data_flow",
        code: "Data Flow Between Systems",
        desc: "This code captures information about how data or outputs from one AI system are transferred, integrated, or reused in other systems.",
        quotes: [
          `"[The AI post-call analysis tool produces] two summaries. One is intended… for a human to read, and one is optimised for further technological processing" (Interview 20)`,
          `"[The Untrite real-time tool] automatically searches all of the other police databases that we have and brings all the information back for the human to review" (Interview 20)`,
        ],
      },
      {
        id: "c_chain_operational",
        code: "Operational Impacts",
        desc: "This code captures information about how chaining affects workflows, efficiency, or decision-making within policing.",
        quotes: [
          `"I can imagine some kind of agentic forensic tool that goes off and runs a bunch of tools and takes the output of those and feeds those through into other bits and makes decisions on that" (Interview 16)`,
          `"if you have Teams Premium or Copilot Premium that would then just summarise and generate a summary at the end of it. Those are multiple different processes that go into it" (Interview 19)`,
        ],
      },
      {
        id: "c_chain_governance",
        code: "Governance and Oversight Challenges",
        desc: "This code captures information about difficulties in monitoring, regulating, or assigning accountability across interconnected AI systems.",
        quotes: [
          `"[Chaining can occur] if we’re thinking about disclosure as a safeguard to police AI but then disclosure itself is being conducted by AI" (Interview 17)`,
          `"I'm not aware of anything at the moment, but I think we do need to be really aware of that because one AI tool could be used on a particular document" (Interview 22)`,
          `“one of our challenges here…is that the technology is moving at a breathtaking pace and it’s really difficult for us to keep up” (Interview 5)`,
          `“…in relation to say digital forensics and the hiding of evidence…at the moment if we go and seize a device from someone then the evidence may include, for example, their Google search history, the things that have been saved on their device, whereas if they have been filtering things through a language model there may not be an immediately obvious way to recover that history. That data may be stored temporarily on a server somewhere…but there’s already this shift in how we access that information” (Interview 13)`,
          `“Road names, the spelling of road names is a particular challenge… The spelling of proper names, again unless it's actually spelt out can be a challenge [for the AI post-call analysis tool]…Under the Welsh Language Act for the four forces in Wales I'm required to provide exactly the same capability in Welsh. There ain't many LLMs that do Welsh, unfortunately” (Interview 20)`,
        ],
      },
      {
        id: "c_chain_mitigation",
        code: "Mitigation Strategies",
        desc: "This code captures information about measures designed to manage risks, prevent errors, or control unintended consequences in chained AI processes.",
        quotes: [
          `"[Different LLMs are used] for different purposes… for each of those stages of processing we have very, very carefully and forensically looked at what's the accuracy level required" (Interview 20)`,
          `"If we don't illuminate [transcription accuracy concerns] and we just assume the transcription is accurate, then potentially everything else could become biased that follows" (Interview 20)`,
        ],
      },
    ],
  },
  // ── Note: the original file had a stray null (double comma) here. Removed. ──
  {
    id: "t5",
    theme: "Benefits and opportunities",
    themeDesc:
      "This theme captures information about the positive impacts, advantages, and potential gains associated with the use of AI in policing and criminal justice.",
    codes: [
      {
        id: "c41",
        code: "Time Savings and Efficiency",
        desc: "This code captures information about how AI reduces workload, automates routine tasks, or speeds up processes.",
        quotes: [
          `"From this process, the whole point of using or what we're trying to do to achieve by using AI is efficiency" (Interview 2)`,
          `"there's so much of what humans do in policing that is time consuming or frustrating or physically hard to do that I can see AIs being extremely powerful at being that assistant" (Interview 5)`,
          `"I think AI could rapidly speed [cell site analysis] up" (Interview 25)`,
          `“[The AI system provides me with real-time data] that I would have to go and find. It’s a bit of a safety net. It gives me the prompts to help me do my job…the call handler can sit and listen to the call and [the AI] can do a lot of the work populating systems for them so they concentrate on the call rather than typing away furiously or making notes which they then retrospectively have to update the systems with” (Interview 6)`,
          `“the benefit [of using AI for redaction] comes to the users who spend hours doing repeat and very tedious...redaction work manually” (Interview 7)`,
          `“…there is efficiency…if you’re familiar with P v NP as a mathematical construct in the sense of it’s used in encryption and things like that…basically…it is far easier and quicker to verify the answer to a problem than it is to solve it from scratch, which is what all encryption is based on, and I think that’s the same [with AI]… whilst it is a very valid concern as to the amount of time that verification takes, used properly I think verification will almost always be faster than drafting from scratch…that is on the assumption that you have a tool…where every line that it is saying it is putting a footnote and linking not just to the document…but to the relevant paragraph of the relevant document and then highlighting that” (Interview 15)`,
          `“if the [Vigil AI] tool says no, nothing, nothing here, then you’re not wasting time with a person looking through trying to search things on the device... I think if it says yeah there is stuff then clearly again it’s not like you’re going to want to pour over potentially hundreds of images, but you may only need to take a very small sample to establish that the machine’s doing what the machine claims” (Interview 16)`,
          `“One area where I’m a bit confused why there hasn’t been more progress is in transcription services for... criminal cases. My understanding is that transcriptions are still costing several thousand pounds and if victims want a full transcript of their case, they have to pay for that. I just don’t know why that’s still a thing” (Interview 17)`,
          `“He [the reluctant staff member] might get to the stage where actually thinks this has saved me a hell of a lot of time” (Interview 18)`,
          `“[An automated file builder] just supports officers with the demands that that takes and automates them and that process... it seems sensible and it's a big demand on time” (Interview 19)`,
          `“[The AI post-call analysis tool allows us] to be much more targeted in our staff development and improvement rather than just saying… our performance rate of giving forensic preservation advice, we missed twenty per cent of calls, you're all rubbish… [The 101 intention capture] seeks to identify the calls that are about something that is not the responsibility of policing and then signposts the caller to the correct organisation” (Interview 20)`,
          `“I haven't seen efficiency yet. I've seen efficiency in automation, absolutely, and getting emails sent to the right mailbox and sorting things and categorising things” (Interview 21)`,
          `“The time it's [LATIS] going to save them [SCAS]… means they can analyse more cases that are coming into them and respond to more of those cases” (Interview 23)`,
          `“There's many more things that scientists, specialised skilled people, are wasting time doing mundane repetitive work that could be supported by AI that frees them up to do the scientific work for which they're trained” (Interview 24)`,
        ],
      },
      {
        id: "c42",
        code: "AI benefits beyond time savings",
        desc: "This code captures information on the need to extend AI benefits beyond mere time savings to other, more impactful outcomes.",
        quotes: [
          `"policing are tending to look for time savings and efficiencies and they're not always there to be had" (Interview 9)`,
          `"[with vigil AI], you are reducing the need for people to look at extremely unpleasant images" (Interview 16)`,
          `“there’s so much of what humans do in policing that is time consuming or frustrating or physically hard to do that I can see AIs being extremely powerful at being that assistant” (Interview 5)`,
          `“[The AI system provides me with real-time data] that I would have to go and find. It’s a bit of a safety net. It gives me the prompts to help me do my job…the call handler can sit and listen to the call and [the AI] can do a lot of the work populating systems for them so they concentrate on the call rather than typing away furiously or making notes which they then retrospectively have to update the systems with” (Interview 6)`,
          `“the benefit [of using AI for redaction] comes to the users who spend hours doing repeat and very tedious...redaction work manually” (Interview 7)`,
          `“…there is efficiency…if you’re familiar with P v NP as a mathematical construct in the sense of it’s used in encryption and things like that…basically…it is far easier and quicker to verify the answer to a problem than it is to solve it from scratch, which is what all encryption is based on, and I think that’s the same [with AI]… whilst it is a very valid concern as to the amount of time that verification takes, used properly I think verification will almost always be faster than drafting from scratch…that is on the assumption that you have a tool…where every line that it is saying it is putting a footnote and linking not just to the document…but to the relevant paragraph of the relevant document and then highlighting that” (Interview 15)`,
          `“One area where I’m a bit confused why there hasn’t been more progress is in transcription services for... criminal cases. My understanding is that transcriptions are still costing several thousand pounds and if victims want a full transcript of their case, they have to pay for that. I just don’t know why that’s still a thing” (Interview 17)`,
          `“He [the reluctant staff member] might get to the stage where actually thinks this has saved me a hell of a lot of time” (Interview 18)`,
          `“[An automated file builder] just supports officers with the demands that that takes and automates them and that process... it seems sensible and it's a big demand on time” (Interview 19)`,
          `“[The AI post-call analysis tool allows us] to be much more targeted in our staff development and improvement rather than just saying… our performance rate of giving forensic preservation advice, we missed twenty per cent of calls, you're all rubbish… [The 101 intention capture] seeks to identify the calls that are about something that is not the responsibility of policing and then signposts the caller to the correct organisation” (Interview 20)`,
          `“I haven't seen efficiency yet. I've seen efficiency in automation, absolutely, and getting emails sent to the right mailbox and sorting things and categorising things” (Interview 21)`,
          `“The time it's [LATIS] going to save them [SCAS]… means they can analyse more cases that are coming into them and respond to more of those cases” (Interview 23)`,
          `“There's many more things that scientists, specialised skilled people, are wasting time doing mundane repetitive work that could be supported by AI that frees them up to do the scientific work for which they're trained” (Interview 24)`,
          `“I think AI could rapidly speed [cell site analysis] up and frankly, with access from the networks as to how powerful each individual cell is… AI could very quickly say this is where a phone was or wasn't and I'll plot you a map quickly” (Interview 25)`,
        ],
      },
      {
        id: "c43",
        code: "Improved quality and consistency",
        desc: "This code captures references to improvements in the quality, reliability, or consistency of outputs.",
        quotes: [
          `"[Anathem] allows the officer to ensure that those points to prove have been coordinated" (Interview 2)`,
          `"I sometimes throw it through Copilot to say can you just redraft or make it more empathetic or take the harshness out of it" (Interview 18)`,
          `“What is also hugely problematic…is data quality and some people get very worried about this. Forces vary quite a lot in how well they do on data cleaning and how accurate their data are and so forth” (Interview 7)`,
          `“Actually it's not hugely difficult to use machine learning with the data that we have, albeit our data's a bit messy, but if you clean it a bit to be able to identify your [targets using] fairly high precision and recall algorithms” (Interview 19)`,
          `“I remember in my… school exams on school computer science… the old adage if you put garbage in you'll get garbage out. So, I think there's a real challenge with some of the data quality that we potentially could be facing… [At] the very first stage of the processing… the transcription [carried out by the AI post-analysis tool] from the audio to a usable digital format, we wanted to really understand… whereabouts might impurity into the processing of that data start to appear” (Interview 20)`,
          `“[There is] too much risk of duplication in there which obviously impacts our data protection compliance and processes, and the risk that the corporate record which has to be preserved, not only for the length of a case but also afterwards and sometimes long beyond for cases of historical or real prominence… if we break that whole process that's been there for generations and generations because we used Copilot is not good” (Interview 21)`,
        ],
      },
      {
        id: "c44",
        code: "Creation of robust synthetic test data",
        desc: "This code captures references to the development and use of synthetic data for testing, training, or validating AI systems.",
        quotes: [
          `"We are hoping that [AI]…could…[be used to] robustly produce both the test data" (Interview 5)`,
          `"We created a synthetic generator of conversations" (Interview 20)`,
        ],
      },
      {
        id: "c45",
        code: "Support for Neurodiverse Officers",
        desc: "This code captures references to measures, policies, or practices aimed at supporting neurodiverse officers.",
        quotes: [
          `"there was an officer in RVR that was dyslexic, so neurodiverse, and actually that officer…found using [Anathem] was really beneficial to them" (Interview 2)`,
          `"for dyslexic officers they really enjoyed the ability for [AI] to be able to compose the statement" (Interview 9)`,
        ],
      },
      {
        id: "c46",
        code: "Enhanced Decision-Making",
        desc: "This code captures information about AI's contribution to more informed, accurate, or timely decisions by professionals.",
        quotes: [
          `"The power always remains with the human at the end of it, but it's our job to try to give them the tools and the access to the expertise that they need to be able to make those best decisions at the front line" (Interview 5)`,
          `"[using Untrite THRIVE AI] was not about removing the human and taking the decision making away from the human, the human makes the decision and then we display the score" (Interview 6)`,
          `"It [the legal policy tool] will help you decide or bring up the information or the legal policies around that to help you decide where it [the charge] would best sit in that list of different types of assaults" (Interview 18)`,
          `"How can we pull that data into a place that makes it meaningful for an early decision maker to enhance the decision making quality at that first stage" (Interview 19)`,
          `"[The Untrite real-time tool] goes on to then work with a human to draft an assessment… of the threat, harm, risk and vulnerability of that particular incident" (Interview 20)`,
          `"[LATIS] provides the human with a way of structuring and prioritising… where do they focus their limited time in a way that would hopefully maximise the chances of them finding genuine links" (Interview 23)`,
        ],
      },
      {
        id: "c47",
        code: "Reliance on AI in Decision-Making",
        desc: "This code captures information about the extent to which professionals depend on AI outputs when making operational or strategic decisions. It includes examples of deference to AI recommendations, incorporation of probabilistic information into judgment, and situations where human discretion is influenced or overridden by AI-generated guidance.",
        quotes: [
          `"Where opinions are subjective and they're on borderline quality of marks… I think that AI could play a part in leading to a swifter resolution of those kind of borderline quality things" (Interview 24)`,
          `"It might be able to put ten lots of call data for ten different phones in and say do they call any of these numbers and it would give me the answer immediately" (Interview 25)`,
        ],
      },
      {
        id: "c48",
        code: "Resource Optimisation",
        desc: "This code captures information about how AI supports better allocation of personnel, funding, or other organisational resources.",
        quotes: [
          `"In our tasking unit I think [AI] could really support the distribution of work, the allocation of casework" (Interview 24)`,
          `“…we don’t necessarily need more money to provide a better service... there is a huge amount of things that we could be doing with our existing data, with our existing people with the existing technology to provide a far superior service to the public” (Interview 13)`,
          `“[Targeted intervention] to the individual employee to say we found some calls here where you've forgotten to do this, is there anything we can do to help you” (Interview 20)`,
        ],
      },
      {
        id: "c49",
        code: "Innovation and Experimentation",
        desc: "This code captures information about AI enabling new approaches, pilot projects, or creative solutions within policing.",
        quotes: [
          `"I think there is more innovation than we think" (Interview 19)`,
          `"Not only did we want to develop AI to help solve the problem that we have, but also we wanted to understand what would be the difference between us designing and building it and versus going out and buying something commercially" (Interview 20)`,
          `“I don't want to say really immature because we were very immature when I started eighteen months ago. I think we've built on our maturity, that we've built on our knowledge, we've learnt from our mistakes” (Interview 21)`,
          `“We iteratively over a couple of years and lots of discussions and focus groups developed this piece of software [LATIS]… We designed a decision making experiment where we had a group of the SCAS analysts… we were tracking their eyes to see what part of the visualisation they were looking at. We did questionnaires with them… We did interviews as well and focus groups” (Interview 23)`,
          `“I think the bar is actually not the enemy. I think most people would be willing to embrace it… we also like to pick a fight and so whilst one month I might be asked what do you think of this and can we use this and I'm prosecuting and say yeah, this is going to be great” (Interview 25)`,
        ],
      },
      {
        id: "c50",
        code: "Improved Public Service",
        desc: "This code captures information about AI enhancing service delivery, responsiveness, or engagement with the public.",
        quotes: [
          `"[The Salesforce portal technology] is particularly interesting for a number of different reasons, one that it... does seem to be effective at improving the journey through the criminal justice system" (Interview 19)`,
        ],
      },
      {
        id: "c51",
        code: "Knowledge and Insight Generation",
        desc: "This code captures information about AI helping to identify patterns, trends, or intelligence that would otherwise be difficult to detect.",
        quotes: [
          `"The purpose of the [AI post-call analysis] tool [is] to very easily provide insight into the totality of what citizens are contacting a police force about" (Interview 20)`,
          `"We generate data that could help inform where new drugs were being found in the country" (Interview 24)`,
        ],
      },
    ],
  },
  {
    id: "t6",
    theme: "Procurement, governance, evaluation, and mitigation strategies",
    themeDesc:
      "This theme captures information about how AI tools are acquired, overseen, assessed, and managed to ensure effective, accountable, and responsible use.",
    codes: [
      {
        id: "c52",
        code: "Procurement Processes",
        desc: "This code captures information about how AI systems are sourced, tendered, contracted, or licensed.",
        quotes: [
          `"We've got our Seven Force Procurement, so we're in a collaboration in terms of Seven Forces for procurement purposes" (Interview 2)`,
          `"It's not just from a security and ethics point of view, but it's also from a data protection point of view and also cyber point of view" (Interview 18)`,
        ],
      },
      {
        id: "c53",
        code: "Governance Structures",
        desc: "This code captures information about organisational or external oversight mechanisms.",
        quotes: [
          `"[College of Policing has] produced some guidance on the use of building your own capability in AI use in policing" (Interview 7)`,
          `"We've [CPS] developed a process which allows police forces to engage with both the NPCC and the CPS" (Interview 22)`,
          `“we’re no longer for the most part buying proprietary software” trust. (Interview 13)`,
          `“you’re up against a system that starts from the point of view of... determinism and cross examination... If it comes to an evidential case...I can put someone on the stand and cross examine them about how the tool works and you have that challenge of an AI model of someone stands up there and says we ran the tool and it said this happened and the defence say explain to me how it works. Well, you multiply some matrices together and that was the answer. It’s really difficult” (Interview 16)`,
          `“There’s an argument, especially with unexplainable models used within summarisation and transcription that you don’t need those models to be explainable because you have that independent source of verification [the original audio or text]” (Interview 17)`,
          `“This is one of the things that we're trying and failing to talk to tech companies about... they don't let you know what they're using and so actually your ability to then understand and compare apples with apples if you're making a commercial decision or if you're even just making a decision about the use of it, you don't really know what is happening, which is a worry” (Interview 19)`,
          `“I've never been able to find out of these commercial vendors what their LLMs have been trained on. Very, very opaque… A lot of suppliers of AI capability commercially will sell you a container… and it's very opaque as to what happens inside that box” (Interview 20)`,
        ],
      },
      {
        id: "c54",
        code: "Evaluation and Validation",
        desc: "This code captures practices related to testing, auditing, or assessing AI performance, accuracy, and reliability.",
        quotes: [
          `"we are building in independent assessments of practice so that we can have that scrutinised to check our datasets" (Interview 8)`,
          `"The key to it all is evaluation and that is agile" (Interview 9)`,
          `"[We assessed LLMs] across three criteria: accuracy, speed and cost" (Interview 20)`,
          `“[police] forces that are [using AI are] very much looking at which is the right LLM that gives them the right results…they might try different ones and see whether the outcomes they achieve are the best from it. [T]hat level of evaluation [is] input versus output rather than anything more complicated than that that I’m aware of at this stage” (Interview 5)`,
          `“what [College of Policing is] doing is identifying opportunities [and]…innovation…and…evaluating which ones of those innovations are demonstrating good outcomes and then using what we find from that to help roll out and provide implementation support to forces on those innovations that have been identified as fruitful for all forces to adopt…[we also provide] data tools for forces to be able to compare themselves with other forces to see to what extent they seem to be…more or less productive…than their colleagues and then trying to explore why that might be the case” (Interview 7)`,
          `“we’ve basically built our own test datasets in each of those different domains...Each time we do it we run it against all of our different models... and then we effectively optimise all improvements in aggregate to make sure that if we’re improving the model for one specific use case that it’s not getting any worse for anybody else” (Interview 14)`,
          `“[Rather than] get all the really enthusiastic techy people together [to run a pilot]…I always try and have a really broad cross section of people from different offices, different business groups, different types of law, different demographics of all types and different comfort levels with technology as well” (Interview 15)`,
          `“[It means] integrating them [human rights] into all of the processes that surround the initial questions of what is the problem, and is AI the right solution, do we try it, the design stages, the human rights implicated within data, bias assessment analysis, et cetera, through development to deployment and then afterwards to monitoring and evaluation…human rights impact assessments, no one’s making anyone do them, so they don’t want to do them” (Interview 17)`,
          `“What we'd want to be able to do is generate... some real and synthetic data to be able to have a sandbox environment where we then test those tools in a standardised way and then at the end of it…if you're good enough you get on this framework…if you’re absolutely exceptional, we’ll probably just pay for it and do a national procurement of it” (Interview 19)`,
          `“We had effectively a fake interview that happened internally… The police force did a fake interview that was submitted… sent over to the CPS for us to kind of have a look at the material. Alongside that the transcript. And alongside that was the statement. And we were able to… go through and see… the quality of the [output of the AI] tool, but also identify some of the potential pitfalls” (Interview 22)`,
          `“[We used] cross-fold validation, like ten folds basically. That was based on the solved offences… We have things like the AUPRC [Area Under Precision-Recall Curve]… We also came up with some of our own metrics… We asked the [SCAS] unit… how many offences do you think you're likely to look down in this list and initially they said probably no more than the top hundred, then later they said well maybe we would extend it to the top five hundred so we used their guidance” (Interview 23)`,
          `“Every speed camera we pass or the speed guns that you see, they're all Home Office approved, and there was loads and loads and loads of challenge to those but eventually, if it's got a Home Office approval certificate then it's allowed. Equally, there are authorised testing, so the DNA testers for example are all approved testers, they meet certain standards” (Interview 25)`,
        ],
      },
      {
        id: "c55",
        code: "Risk Mitigation Strategies",
        desc: "This code captures measures taken to minimise operational, ethical, or legal risks associated with AI deployment.",
        quotes: [
          `"start with the things that are most useful to policing and the lowest risk rather than things which sound really exciting" (Interview 7)`,
          `"We go firstly into what we call a harms workshop… we talk about the intended use of whatever the solution is" (Interview 21)`,
        ],
      },
      {
        id: "c56",
        code: "Transparency and Reporting",
        desc: "This code captures practices or policies designed to ensure visibility of AI processes, outputs, and decisions to stakeholders.",
        quotes: [
          `"One of the things [the Home Office is] asking the [NPCC] AI portfolio to do this year is we're basically saying we're going to give you some money, but we want you to get as much information as possible mapping the ecosystem" (Interview 3)`,
          `"[We developed] what I call transparency of reasoning" (Interview 20)`,
          `“I think part of the problem is awareness [of AI tools in policing] can be largely based on or reliant on anecdotal understanding because I don’t think there’s been particularly disciplined use of the ATRS [Algorithmic Transparency Recording Standard] but of course [it] isn’t mandatory for those outside central government, like police forces” (Interview 17)`,
          `“We [CPS] have shared with the Cabinet Office, and I believe it's online, our algorithmic [transparency record], it's ATRS if you have a look on the Cabinet Office website it's already on there because this is our first tool that we've gone live with” (Interview 18)`,
          `“[Performance information] is also, by the way, the thing that we should be pushing transparently outside as well” (Interview 19)`,
          `“[We are] looking at building on [monitoring] so that we can get more detail around that, one as a way to monitor compliance with policy, but two, to identify why users are using AI in a certain way” (Interview 21)`,
          `“It's really important that we are open and transparent with the use of AI tools… making sure that… everybody within the criminal justice system is aware of the use of AI… that engagement in particular with victims and with witnesses in relation to trust and transparency and making sure that they're aware of what AI is being used” (Interview 22)`,
        ],
      },
      {
        id: "c57",
        code: "Vendor and Stakeholder Management",
        desc: "This code captures interactions, responsibilities, or collaborations with technology providers, funders, or other external stakeholders in AI projects.",
        quotes: [
          `"We're looking to build and we're looking to buy AI… [When buying] that takes a bit of work behind the scenes to work out actually how did they build them" (Interview 21)`,
          `"The fundamental primary requirement would be around data protection… data security and data sovereignty" (Interview 24)`,
          `“it’s very difficult to be a clever, a smart buyer, because every operational, ethical, or legal vendor is coming to you and saying that their tools are AI standards. enabled…I have these frustrating conversations with sales people where they basically refuse to tell you what’s under the hood” (Interview 13)`,
          `“People think Axon are doing AI. No they’re not. What they're doing is they're just using a foundation model and repurposing it, probably not even fine tuning it in any shape or form and just putting it in their text DAC. Same with Palantir, Palantir are an AI company. No, they're not. They are a company that repurposes AI to enable analysis of big data…but they’re not even, I don’t think they’re even fine tuning anything or doing anything specifically interesting” (Interview 19)`,
          `“I've been sold or tried to be sold so many things that quite clearly aren't AI but because it’s just an easy, lazy term, isn’t it really, AI” (Interview 20)`,
        ],
      },
      {
        id: "c58",
        code: "Developing standards and checklists",
        desc: "This code captures references to the creation or use of formal standards, guidelines, checklists, or assessment frameworks.",
        quotes: [
          `"[Home Office is] planning to ask our ministers to endorse [PROBabLE Futures responsible AI checklist]" (Interview 3)`,
          `"We go through… the data protection impact assessment and equalities impact assessment… and a data ethics impact assessment." (Interview 21)`,
        ],
      },
      {
        id: "c59",
        code: "Inter-agency collaboration and knowledge sharing",
        desc: "This code captures references to collaboration, coordination, and information exchange between different agencies.",
        quotes: [
          `"there's…an increasing amount of joint working between the different [CJS] entities" (Interview 3)`,
          `"We [NPCC] are working closely with the MoJ and Justice AI and others to work this stuff out" (Interview 19)`,
          `“We generate data that could help inform where new drugs were being found in the country, where bad patches of drugs… were killing people… but all that data is there. We provided on some level but we're not doing intelligent interpretation of that data for what it may drive” (Interview 24)`,
        ],
      },
      {
        id: "c60",
        code: "Public participation and policing by consent",
        desc: "This code captures information about the importance of including the public in decisions about AI deployment in policing.",
        quotes: [
          `"[We] need to include the public at all stages which looks at the importance of public participation from the perspective of legitimacy, democratic accountability and the principle of policing by consent" (Interview 17)`,
          `“it’s very difficult to be a clever, a smart buyer, because every operational, ethical, or legal vendor is coming to you and saying that their tools are AI standards. enabled…I have these frustrating conversations with sales people where they basically refuse to tell you what’s under the hood” (Interview 13)`,
          `“People think Axon are doing AI. No they’re not. What they're doing is they're just using a foundation model and repurposing it, probably not even fine tuning it in any shape or form and just putting it in their text DAC. Same with Palantir, Palantir are an AI company. No, they're not. They are a company that repurposes AI to enable analysis of big data…but they’re not even, I don’t think they’re even fine tuning anything or doing anything specifically interesting” (Interview 19)`,
          `“I've been sold or tried to be sold so many things that quite clearly aren't AI but because it’s just an easy, lazy term, isn’t it really, AI” (Interview 20)`,
        ],
      },
    ],
  },
  {
    id: "t7",
    theme: "Funding and innovation",
    themeDesc:
      "This theme captures information about the financial resources, investment mechanisms, and innovation processes that enable the initiation, development, and scaling of AI projects, including government grants, internal budgets, police innovation funds, and the stages through which funded projects typically progress.",
    codes: [
      {
        id: "c61",
        code: "Sources of Funding",
        desc: "This code captures information about the origins of financial support for AI projects.",
        quotes: [
          `"We [PCSA] are funding projects associated with AI…we have two funding streams…one is the STAR fund" (Interview 8)`,
          `"Home Office…give money to bits of policing to procure it for policing" (Interview 3)`,
          `“The ideas come in and then they're looked at by the team of people... we'll have a chat about it, bring it up to a meeting and then decide whether it's something we should be looking at further” (Interview 18)`,
          `“The ideas come in and then they're looked at by the team of people... we'll have a chat about it, bring it up to a meeting and then decide whether it's something we should be looking at further” (Interview 18) [In describing Technology Readiness Levels (TRL)] I would likely use alpha, beta or production” (Interview 19)`,
          `“[We] first of all [tested] in a lab that the way in which we had configured and wired together all of the different components of the capability [worked]… [then used] just short of 5,000 genuine recordings from West Yorkshire Police on which we initially did our training… [We are now] repeating the test with Hertfordshire… then going to expand into Cambridgeshire and Bedfordshire… [then] looking, subject to funding… at how do we make the [AI post-call analysis] tool available to all forces nationally” (Interview 20)`,
          `“There is a full process map attached to the whole thing… the different project stages, so discovery, alpha, beta. And the harms workshop is just the first step… Usually, generally we don't hear from them for a little while after that as they go away and they refine things and do a bit more detail, and then we start to go through the project milestones as they fall into the alpha process” (Interview 21)`,
          `“That engagement [between police forces, NPCC, and CPS] takes place on effectively three levels… early engagement when forces are really just thinking about an idea and potentially they have like a proof of concept… You then got beta… now they want to use the AI tool on live cases and live data… we would look to support the relevant local force… [to] undertake evaluation and see whether… it will become business as usual” (Interview 22)`,
        ],
      },
      {
        id: "c62",
        code: "Innovation pipeline stages",
        desc: "This code captures how AI projects typically move through an innovation pipeline, starting with an exploratory phase, then progressing to blueprinting and requiring evaluation before wider or national rollout.",
        quotes: [
          `"Most of them are within the exploratory phase…they then go for blueprinting and they need an evaluation" (Interview 8)`,
          `"We have an innovation map, so we know all of the different innovations that the forces are doing" (Interview 8)`,
          `“I don't want to say really immature because we were very immature when I started eighteen months ago. I think we've built on our maturity, that we've built on our knowledge, we've learnt from our mistakes” (Interview 21)`,
          `“We iteratively over a couple of years and lots of discussions and focus groups developed this piece of software [LATIS]… We designed a decision making experiment where we had a group of the SCAS analysts… we were tracking their eyes to see what part of the visualisation they were looking at. We did questionnaires with them… We did interviews as well and focus groups” (Interview 23)`,
          `“I think the bar is actually not the enemy. I think most people would be willing to embrace it… we also like to pick a fight and so whilst one month I might be asked what do you think of this and can we use this and I'm prosecuting and say yeah, this is going to be great” (Interview 25)`,
        ],
      },
      {
        id: "c63",
        code: "Investment Priorities",
        desc: "This code captures information about how funding decisions are prioritised across AI projects.",
        quotes: [
          `"A high proportion of our work that we have funded this year is AI focused" (Interview 8)`,
        ],
      },
      {
        id: "c64",
        code: "Government Stance on AI Adoption",
        desc: "This code captures references to government positions, priorities, or policy orientations regarding the adoption of AI.",
        quotes: [
          `"Because there was a change of government and because AI is an emerging field that's fast changing, I would describe our policy approach as being, unsettled" (Interview 3)`,
          `"The government's centralised push strategy, the AI Opportunities Action Plan, all of that is a growth strategy" (Interview 17)`,
        ],
      },
      {
        id: "c65",
        code: "Funding Criteria",
        desc: "This code captures references to the formal or informal criteria used to allocate funding for AI projects.",
        quotes: [
          `"when we [Home Office] give funding to bits of policing to procure stuff for policing we do so often with conditions attached" (Interview 3)`,
        ],
      },
      {
        id: "c66",
        code: "Innovation Drivers",
        desc: "This code captures information about organisational, technological, or policy factors that motivate experimentation and innovation with AI.",
        quotes: [
          `"We don't want to say absolutely no, but what we want to say is you're trying to do this, this is our approved tools." (Interview 18)`,
        ],
      },
      {
        id: "c67",
        code: "Pilot and Experimental Projects",
        desc: "This code captures information about early-stage or trial initiatives supported by specific funding or innovation programmes.",
        quotes: [
          `"That engagement [between police forces, NPCC, and CPS] takes place on effectively three levels… early engagement when forces are really just thinking about an idea and potentially they have like a proof of concept" (Interview 22)`,
          `"[We] first of all [tested] in a lab... [We are now] repeating the test with Hertfordshire… then going to expand into Cambridgeshire and Bedfordshire" (Interview 20)`,
        ],
      },
      {
        id: "c68",
        code: "Partnerships and Collaborations",
        desc: "This code captures information about collaboration with other police forces, vendors, academia, or other agencies.",
        quotes: [
          `"Some [police forces] will be building them [AI tools] off with the usual IT companies" (Interview 8)`,
          `"as a region [the Eastern Region Innovation Network], we can actually be more efficient and work together to do things once" (Interview 9)`,
          `“[There is a joint function]…between two police forces [Thames Valley and Hampshire Police] that collaborate…that is a collaboration that is probably one of the longest in the UK and one of the strongest in the UK…[both police forces use]…shared tools, so they use the same record management system, they use the same contact management system, et cetera, et cetera” (Interview 11)`,
        ],
      },
      {
        id: "c69",
        code: "Scaling and Sustainability",
        desc: "This code captures information about efforts to expand successful AI projects, maintain funding, or ensure long-term viability.",
        quotes: [
          `"We set up [the Eastern Region Innovation Network] three years ago…to share best practice, research and innovation [across seven police forces in the Eastern Region]" (Interview 9)`,
          `"[We need to understand] how do you do joint data control agreements" (Interview 20)`,
          `“We could potentially reuse the correspondence drafter for other types of correspondence, for argument's sake because the correspondence drafter at the moment is only for one dedicated piece of work, so we could open that up and use it for other types of dedicated work like witness warnings or witness availability.” (Interview 18)`,
          `“[We're] hoping to get some significant investment and the ability to do that [centralised evaluation] in the next two to three years” (Interview 19)`,
          `“We've done research with other crime types so of course we are interested in the future of exploring extending the tool to other crime types at which point yes, certainly other forces would potentially start using it. But at the moment it's just this [SCAS] unit” (Interview 23)`,
        ],
      },
      {
        id: "c70",
        code: "AI investment cycles and sustainability risk",
        desc: "This code captures information about the risk that current levels of investment in AI may not be sustained.",
        quotes: [
          `"I heard somebody was talking the other day about the years that we go through with AI, sometimes it gets a lull because there's no investment" (Interview 18)`,
        ],
      },
    ],
  },
  {
    id: "t8",
    theme: "Future outlook and recommendations",
    themeDesc:
      "This theme captures information about anticipated developments, potential applications, and strategic recommendations for AI in policing.",
    codes: [
      {
        id: "c71",
        code: "Desired future tools",
        desc: "This code captures references to new or upcoming AI tools and innovations expected to be adopted in policing.",
        quotes: [
          `"I've seen an AI technology for fingerprint identification…It's only early concepts but it fills in the minutia of your fingerprint and can potentially give you or predict where the next one is likely to come" (Interview 8)`,
          `"An end-to-end sort of portal and integration throughout the criminal justice system" (Interview 19)`,
          `"Things like CCTV recreations" (Interview 25)`,
          `“a closed Ai [that] could never reach out to the internet…but having that ability to draw and summarise stuff that’s already in our repository of products would be really good” (Interview 1)`,
          `“[A] chronology builder concept…for case preparation [is a key area of interest]…[such a system] could pull material from different parts of the case together, whether it’s witness statements, phone records, chat logs, CCTV footage” (Interview 10)`,
          `“In the future I see AI functionality being throughout most of our systems. There’s so many use cases and reasons why it can help and speed up processes…I think the world’s the oyster in terms of what could be done, it’s just getting there and making sure we’re doing it in an appropriate and proportionate way” (Interview 2)`,
          `“We [Thames Valley and Hampshire Police] will be doing agentic AI later this year. It starts in the summer…I’m looking at it going into quite a soft area of contact management” (Interview 11)`,
          `“One of the interesting ways of using [AI] is where you've got forms of data which are quite diverse, so like text and video and images, ones and zeroes, the ability of AI to process all of those different forms and also potentially bring them together because I think that's a very difficult thing for a human to do… I think that's potentially an area which will probably develop more and be potentially quite useful in a policing context” (Interview 23)`,
          `“Automated report generation from results, absolutely. Automated data entry in terms of findings… making connections and links across cases… autogenerating of intelligent reporting… [and in the future] genome sequencing where we would be able to offer information about what a potential person of interest would look like” (Interview 24)`,
        ],
      },
      {
        id: "c72",
        code: "Predicted Operational Changes",
        desc: "This code captures expectations about how AI might transform workflows, decision-making, or professional roles.",
        quotes: [
          `"In the next 12 months, I'd very much like to see the AI [AndiESRA] being converted into an LLM" (Interview 5)`,
          `"I think more likely it's the work behind the scenes rather than in the court itself where AI is likely to assist" (Interview 25)`,
        ],
      },
      {
        id: "c73",
        code: "Systemic Implications",
        desc: "This code captures anticipated effects on justice system integrity, public trust, or organisational processes.",
        quotes: [
          `"[There is a risk of] the police… using AI to attend a crime or to record a crime. The AI coming through to CPS." (Interview 21)`,
          `“when we produce a file of evidence to send to the Crown Implications effects on justice system Prosecution Service, policing has a notorious challenge of getting integrity, public trust, or the quality of the file both in terms of the administration and the organisational processes. analysis, the actual quality of it, up to speed. That is exactly the sort of thing we think an LLM would be very, very good” (Interview 5)`,
          `“[A future need is] using AI to spot AI [to counter criminal use of AI]…The AI, the tools need to be created to spot the fakes. But who does that? That has to be down to government, and it has to be trusted. That’s crucial, the element of trust here” (Interview 10)`,
          `“I think there's a trust element here… which is one of the driving reasons why I wanted to absolutely have as much transparency as I possibly could… [I want to be] open and transparent around well these are the challenges we're facing… [I want people to say] I really think you've got that wrong there… for these reasons. Because I'm not an expert at this. I'm just doing what I feel is right” (Interview 20)`,
        ],
      },
      {
        id: "c74",
        code: "Policy and Governance Recommendations",
        desc: "This code captures suggestions for law, regulation, oversight, or organisational governance related to AI.",
        quotes: [
          `"I think ultimately an oversight committee must have knowledge and access to what we're doing" (Interview 6)`,
          `"The first lesson is that AI used by police needs to be fit for purpose... it needs to be used lawfully" (Interview 17)`,
        ],
      },
      {
        id: "c75",
        code: "Training and Capacity Building",
        desc: "This code captures recommendations for developing skills, knowledge, and organisational readiness to engage with AI.",
        quotes: [
          `"someone that understands [prompt guides] [can curate]…the best prompts so that there's a bank of prompts that police officers can use" (Interview 3)`,
          `"I do think it [AI] does have to be included in education now" (Interview 18)`,
          `“We started off with six weeks’ worth of data. It clearly was pressure about the volume of data required useless... and I think we ended up putting something close to four- to make an LLM model functional or five-years’ worth of data through [the AI system] in the end to and the time required to do that. have something that was actually useable at that point” (Interview 6)`,
          `“there definitely seems to be a need for more open tools for discovery, search and investigation in the earlier stages to actually be able to locate things in huge datasets before you then extract the bits you need and then put them through the forensic process” (Interview 14)`,
          `“whilst Gen AI is probably far easier to adopt than some of the legal tech that’s gone before, if you want to automate a document, for a start you need an actual precedent document in the first place, which takes time. Then you’ve got to actually automate the document. If you’re using machine learning you probably need a hundred examples and then someone’s got to go through and label everything up and that takes time” (Interview 15)`,
        ],
      },
      {
        id: "c76",
        code: "Ethical and Risk Considerations",
        desc: "This code captures forward-looking concerns about fairness, bias, accountability, and risk management.",
        quotes: [
          `"The list [of potential applications] is probably endless, to be honest, but I suppose it's although we could whether we should, is the question, isn't it?" (Interview 8)`,
          `"I'm not looking at these from an efficiency saving point of view... the whole thing should be based around getting a better result for people" (Interview 21)`,
          `“There’s so many use cases and reasons why [AI] can help and speed up processes, providing the AI covenant checklists and ethically the ethical use has all been properly coordinated” (Interview 2)`,
          `“I think going into the violence prevention partnership work there’s an element of me that really wants to make sure that what we are doing is ethically right…sometimes we can forget just because we can do something doesn’t mean to say we should do it” (Interview 6)`,
          `“it would be good if we could be guided by principles such as evidence base transparency” (Interview 9)`,
          `“I wanted to be able to highlight all the way through whereabouts might impurities… start to be injected into policing data particularly when that impurity has been created by an automatic technology” (Interview 20)`,
          `“There are a lot that we need to take into account… the accuracy and the reliability of AI, the bias [and] discrimination… transparency and explainability… the impact not just on… public perception, but also on victim and witnesses” (Interview 22)`,
          `“[Referring to the Horizon Post-Office scandal] We tend to put the blame on the software, but often we forget that there was a disclosure disaster there with the state-owned company knowing about the problems” (Interview 25)`,
        ],
      },
      {
        id: "c77",
        code: "Cautious and Iterative Deployment",
        desc: "This code captures recommendations for a cautious, iterative deployment of AI, particularly when it impacts critical legal processes.",
        quotes: [
          `"I would suggest that we hold a lot of data in policing so there are ways in which we could use retrospective data to be able to test something before making it go live, and that should be, I think the first consideration" (Interview 9)`,
          `"I think a slow approach is probably what I’m asking for… perhaps we do [the testing] in a controlled way, so perhaps we say we could do it in a live environment but we’ll do it with CPS’s involvement and we’ll do an evaluation, and maybe we’ll do a randomised control trial for three months" (Interview 9)`,
        ],
      },
      {
        id: "c78",
        code: "Emerging threats from AI",
        desc: "This code captures information about the urgent need to train officers to identify sophisticated AI-generated evidence to avoid miscarriages of justice.",
        quotes: [
          `"there's a real big threat around AI generated misinformation, disinformation and malinformation" (Interview 1)`,
          `"right now, we could be presented with some evidence that we would have no idea is completely AI generated." (Interview 6)`,
          `"[Deepfakes pose a] threat... to criminal evidence and whether seeing and believing will mean the same in a few years" (Interview 10)`,
          `“that whole slightly longer term element of trust in evidence... now potentially legitimately someone might be able to say no, that’s not me, that’s been generated and the technology to appropriately appraise deep fakes has not really caught up” (Interview 13)`,
          `“know now if I look on somewhere like Facebook I cannot trust any of the images that comes up on Facebook because there's so many [AI-generated ones]. Or even the stories, there's just all AI generated so I don't even look at them anymore because I don't even believe them because you don't know what to believe” (Interview 18)`,
        ],
      },
      {
        id: "c79",
        code: "Long-term outlook for policing",
        desc: "This code captures information about broad assessments of the trajectory of AI in law enforcement.",
        quotes: [
          `"policing is always going to be a long time. They're lagged in the grand scheme of things" (Interview 3)`,
          `"AI has huge, huge potential in law enforcement but I think that there are a number of challenges and barriers right now" (Interview 20)`,
          `“Having some sovereign cloud that’s useable in a safe environment in the UK for public safety I think can only be a good thing… there’s a good opportunity through for a sovereign data centre connected to a bunch of live video feeds in not necessarily sensitive but important areas in the UK that allow you some real time search capabilities on top, in the case of bad things happening quickly” (Interview 14)`,
          `“If we're able to do that [have data access and integration], not just from a policing perspective but from a health perspective and from an education perspective, actually we then change the game a bit because previously it's just too difficult to share the data as a whole which is right, because we shouldn't be sharing all that data” (Interview 19)`,
          `“I don't see cases being lost because the evidence is quite clear. Where it's the only evidence… The day when a case is brought solely on the basis of AI generated material is a lot further away than the day when AI has a feature but there is other evidence generated” (Interview 25)`,
        ],
      },
      {
        id: "c80",
        code: "Focus on foundational AI integration",
        desc: "This code captures attention to establishing core AI capabilities and infrastructure as a necessary step before pursuing more advanced applications.",
        quotes: [
          `"From my perspective I'd like to start with the low hanging fruit" (Interview 3)`,
          `"I think we have loads of the technology that can be used...it's about orchestrating it and pulling it together" (Interview 16)`,
          `“We are on the roadmap… looking at what might the role of generative business intelligence be with some of this data so that users can use things like natural language to interact better with the data” (Interview 20)`,
          `“I would say it would be in replicating non-complex straightforward tasks is where we would start with it… we would initially start with…maybe even admin tasks… moving more into then complex pattern recognition, pattern analysis, things that are repeatable already and that you have a good solid bedrock of data from which you can train the AI tool” (Interview 24)`,
        ],
      },
      {
        id: "c81",
        code: "Consolidation of policing landscape",
        desc: "This code captures references to efforts aimed at reducing fragmentation within policing structures.",
        quotes: [
          `"The Home Secretary…plans to reform the policing structures in England and Wales" (Interview 3)`,
          `"Our ambitions are for it [procurement] not to be done in a silo and to be done centrally and done well once in a centre" (Interview 19)`,
          `“it’s very difficult to be a clever, a smart buyer, because every operational, ethical, or legal vendor is coming to you and saying that their tools are AI standards. enabled…I have these frustrating conversations with sales people where they basically refuse to tell you what’s under the hood” (Interview 13)`,
          `“I've been sold or tried to be sold so many things that quite clearly aren't AI but because it’s just an easy, lazy term, isn’t it really, AI” (Interview 20)`,
        ],
      },
      {
        id: "c82",
        code: "System integration (Voice/PNC)",
        desc: "This code captures the future goal of integrating AI with force databases to allow for voice-activated checks.",
        quotes: [
          `"future iterations [of the COPPA AI tool] would see this integrated with your force systems... you could say can you do a PNC check for me on Joe Blogs" (Interview 12)`,
          `“[Untrite does] classification, the ability to transcribe data and then using a large language model to then pick out specific elements of that data that might indicate higher threat, harm or risk... which then goes into data pipeline, so whether that's PNC, the Police National Computer or PND, to pull out data to then give you more of a fuller assessment and supporting decision making” (Interview 19)`,
        ],
      },
      {
        id: "c83",
        code: "Scepticism regarding generative drafting",
        desc: "This code captures doubts about whether generative AI tools deliver genuine efficiency savings in drafting and document preparation.",
        quotes: [
          `"Can it write a statement for me... I'm not a great advocate of that, personally" (Interview 12)`,
          `"I think that everybody looks for efficiency. I haven't seen efficiency yet" (Interview 21)`,
          `“On the more complicated [criminal casework], I don't think I would ever be tempted to use an AI to [draft] that because they are complicated and I need to make sure exactly what I'm setting out” (Interview 25)`,
        ],
      },
    ],
  },
];

// ─── Colour map ───────────────────────────────────────────────────────────────
const COLORS = {
  t1: { bg: "#EEF2FF", border: "#818CF8", text: "#3730A3" },
  t2: { bg: "#F0FDF4", border: "#4ADE80", text: "#166534" },
  t3: { bg: "#FEF2F2", border: "#F87171", text: "#991B1B" },
  t4: { bg: "#FFF7ED", border: "#FB923C", text: "#9A3412" },
  t5: { bg: "#ECFDF5", border: "#34D399", text: "#065F46" },
  t6: { bg: "#F0F9FF", border: "#38BDF8", text: "#0C4A6E" },
  t7: { bg: "#FEFCE8", border: "#FACC15", text: "#713F12" },
  t8: { bg: "#FDF4FF", border: "#C084FC", text: "#581C87" },
};

export default function App() {
  const safeData = JSON.parse(JSON.stringify(initialData))
    .filter((t) => t != null && t.theme)
    .map((t) => ({
      ...t,
      codes: (t.codes || []).filter((c) => c != null && c.code),
    }));

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [data, setData] = useState(safeData);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({ themeId: null, codeId: null });
  const [expandedThemes, setExpandedThemes] = useState({});
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [newQuote, setNewQuote] = useState("");
  const [editingQuoteIndex, setEditingQuoteIndex] = useState(null);
  const [editQuoteVal, setEditQuoteVal] = useState("");
  const [view, setView] = useState("browse");
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");
  const [addingCode, setAddingCode] = useState(null);
  const [newCodeName, setNewCodeName] = useState("");
  const [newCodeDesc, setNewCodeDesc] = useState("");
  const [addingTheme, setAddingTheme] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const [newThemeDesc, setNewThemeDesc] = useState("");

  const flash = (m) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Force-sync the local framework into Firestore so the hosted data
  // matches the latest in-code dataset on first load after login.
  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, "workbench", "mainData");
    setDoc(docRef, { themes: safeData });

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().themes) {
        setData(docSnap.data().themes);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      flash("Successfully logged in!");
    } catch (error) {
      flash("Login failed: " + error.message.replace("Firebase: ", ""));
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setLoading(true);
  };

  const syncData = async (newData) => {
    await setDoc(doc(db, "workbench", "mainData"), { themes: newData });
  };

  const selTheme = data.find((t) => t.id === selected.themeId);
  const selCode = selTheme?.codes.find((c) => c.id === selected.codeId);

  const save = (field, val) => {
    const newData = data.map((t) => {
      if (t.id !== selected.themeId) return t;
      if (field === "theme") return { ...t, theme: val };
      if (field === "themeDesc") return { ...t, themeDesc: val };
      return {
        ...t,
        codes: t.codes.map((c) =>
          c.id !== selected.codeId ? c : { ...c, [field]: val }
        ),
      };
    });
    setData(newData);
    syncData(newData);
    setEditing(null);
    flash("Saved.");
  };

  const moveItem = (list, index, direction) => {
    const newList = [...list];
    const newPos = index + direction;
    if (newPos < 0 || newPos >= newList.length) return newList;
    [newList[index], newList[newPos]] = [newList[newPos], newList[index]];
    return newList;
  };

  const moveTheme = (index, direction) => {
    const newData = moveItem(data, index, direction);
    setData(newData);
    syncData(newData);
  };

  const moveCode = (themeId, index, direction) => {
    const newData = data.map((t) => {
      if (t.id !== themeId) return t;
      return { ...t, codes: moveItem(t.codes, index, direction) };
    });
    setData(newData);
    syncData(newData);
  };

  const moveQuote = (index, direction) => {
    if (!selCode) return;
    const quotes = moveItem(selCode.quotes, index, direction);
    const newData = data.map((t) => ({
      ...t,
      codes: t.codes.map((c) =>
        c.id !== selected.codeId ? c : { ...c, quotes }
      ),
    }));
    setData(newData);
    syncData(newData);
  };

  const addQuote = () => {
    if (!newQuote.trim()) return;
    const newData = data.map((t) => ({
      ...t,
      codes: t.codes.map((c) =>
        c.id !== selected.codeId
          ? c
          : { ...c, quotes: [...c.quotes, newQuote.trim()] }
      ),
    }));
    setData(newData);
    syncData(newData);
    setNewQuote("");
    flash("Quote added.");
  };

  const deleteQuote = (qi) => {
    if (!window.confirm("Delete this quote?")) return;
    const newData = data.map((t) => ({
      ...t,
      codes: t.codes.map((c) =>
        c.id !== selected.codeId
          ? c
          : { ...c, quotes: c.quotes.filter((_, i) => i !== qi) }
      ),
    }));
    setData(newData);
    syncData(newData);
    flash("Quote removed.");
  };

  const saveQuote = (qi) => {
    if (!editQuoteVal.trim()) return;
    const newData = data.map((t) => ({
      ...t,
      codes: t.codes.map((c) =>
        c.id !== selected.codeId
          ? c
          : {
              ...c,
              quotes: c.quotes.map((q, index) =>
                index === qi ? editQuoteVal.trim() : q
              ),
            }
      ),
    }));
    setData(newData);
    syncData(newData);
    setEditingQuoteIndex(null);
    flash("Quote updated.");
  };

  const addCode = (themeId) => {
    if (!newCodeName.trim()) return;
    const id = "c" + Date.now();
    const newData = data.map((t) =>
      t.id !== themeId
        ? t
        : {
            ...t,
            codes: [
              ...t.codes,
              {
                id,
                code: newCodeName.trim(),
                desc: newCodeDesc.trim(),
                quotes: [],
              },
            ],
          }
    );
    setData(newData);
    syncData(newData);
    setExpandedThemes((prev) => ({ ...prev, [themeId]: true }));
    setNewCodeName("");
    setNewCodeDesc("");
    setAddingCode(null);
    flash("Code added.");
  };

  const deleteCode = (themeId, codeId) => {
    if (!window.confirm("Delete this code?")) return;
    const newData = data.map((t) =>
      t.id !== themeId
        ? t
        : { ...t, codes: t.codes.filter((c) => c.id !== codeId) }
    );
    setData(newData);
    syncData(newData);
    if (selected.codeId === codeId)
      setSelected({ themeId: null, codeId: null });
    flash("Code deleted.");
  };

  const addTheme = () => {
    if (!newThemeName.trim()) return;
    const id = "t" + Date.now();
    const newData = [
      ...data,
      {
        id,
        theme: newThemeName.trim(),
        themeDesc: newThemeDesc.trim(),
        codes: [],
      },
    ];
    setData(newData);
    syncData(newData);
    setNewThemeName("");
    setNewThemeDesc("");
    setAddingTheme(false);
    flash("Theme added.");
  };

  const deleteTheme = (themeId) => {
    if (!window.confirm("Delete this theme?")) return;
    const newData = data.filter((t) => t.id !== themeId);
    setData(newData);
    syncData(newData);
    if (selected.themeId === themeId)
      setSelected({ themeId: null, codeId: null });
    flash("Theme deleted.");
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "coding_framework.json";
    a.click();
  };

  const results =
    search.trim().length > 1
      ? data.flatMap((t) =>
          t.codes
            .filter(
              (c) =>
                c.code.toLowerCase().includes(search.toLowerCase()) ||
                c.desc.toLowerCase().includes(search.toLowerCase()) ||
                c.quotes.some((q) =>
                  q.toLowerCase().includes(search.toLowerCase())
                )
            )
            .map((c) => ({ ...c, themeId: t.id, themeName: t.theme }))
        )
      : [];

  const col = (id) => COLORS[id] || COLORS.t1;

  const EditField = ({ label, value, fieldKey, multiline }) =>
    editing === fieldKey ? (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
          {label}
        </div>
        {multiline ? (
          <textarea
            value={editVal}
            onChange={(e) => setEditVal(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              boxSizing: "border-box",
              fontSize: 14,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #d1d5db",
              resize: "vertical",
            }}
          />
        ) : (
          <input
            value={editVal}
            onChange={(e) => setEditVal(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              fontSize: 14,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #d1d5db",
            }}
          />
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button
            onClick={() => save(fieldKey, editVal)}
            style={{
              fontSize: 13,
              padding: "4px 14px",
              borderRadius: 6,
              background: "#eff6ff",
              border: "none",
              color: "#1d4ed8",
              cursor: "pointer",
            }}
          >
            Save
          </button>
          <button
            onClick={() => setEditing(null)}
            style={{
              fontSize: 13,
              padding: "4px 14px",
              borderRadius: 6,
              background: "transparent",
              border: "1px solid #d1d5db",
              color: "#6b7280",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 2 }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 14,
            color: "#111827",
            lineHeight: 1.6,
            cursor: "text",
            padding: "6px 8px",
            borderRadius: 6,
            border: "1px solid transparent",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "transparent")
          }
          onClick={() => {
            setEditing(fieldKey);
            setEditVal(value);
          }}
        >
          {value || (
            <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
              Click to add...
            </span>
          )}
          <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 6 }}>
            ✎
          </span>
        </div>
      </div>
    );

  if (authLoading)
    return (
      <div
        style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}
      >
        Checking secure connection...
      </div>
    );

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#f3f4f6",
          fontFamily: "sans-serif",
        }}
      >
        {msg && (
          <div
            style={{
              position: "fixed",
              top: 16,
              background: "#ef4444",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: 8,
              fontSize: 13,
              zIndex: 999,
            }}
          >
            {msg}
          </div>
        )}
        <form
          onSubmit={handleLogin}
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            textAlign: "center",
            width: "320px",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔒</div>
          <h2
            style={{ margin: "0 0 8px 0", color: "#111827", fontSize: "20px" }}
          >
            Workbench Locked
          </h2>
          <p
            style={{ margin: "0 0 24px 0", color: "#6b7280", fontSize: "14px" }}
          >
            Please sign in to access your framework.
          </p>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              marginBottom: "12px",
              fontSize: "15px",
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              marginBottom: "20px",
              fontSize: "15px",
            }}
            required
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#1d4ed8",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  if (loading)
    return (
      <div
        style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}
      >
        Loading your data securely...
      </div>
    );

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        fontSize: 14,
        color: "#111827",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {msg && (
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            background: "#f0fdf4",
            color: "#166534",
            padding: "8px 18px",
            borderRadius: 8,
            fontSize: 13,
            zIndex: 999,
            border: "1px solid #bbf7d0",
          }}
        >
          {msg}
        </div>
      )}

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid #e5e7eb",
          background: "#fff",
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ fontWeight: 500, fontSize: 16 }}>
            Thematic analysis workbench
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            {data.length} themes ·{" "}
            {data.reduce((a, t) => a + t.codes.length, 0)} codes
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {["browse", "search"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                fontSize: 13,
                padding: "5px 14px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                background: view === v ? "#f3f4f6" : "transparent",
                cursor: "pointer",
                color: "#111827",
                fontWeight: view === v ? 500 : 400,
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
          <button
            onClick={exportJSON}
            style={{
              fontSize: 13,
              padding: "5px 14px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              background: "transparent",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            Export JSON
          </button>
          <div
            style={{
              width: 1,
              height: 20,
              background: "#e5e7eb",
              margin: "0 4px",
            }}
          />
          <button
            onClick={handleLogout}
            style={{
              fontSize: 13,
              padding: "5px 14px",
              borderRadius: 6,
              border: "none",
              background: "#fef2f2",
              cursor: "pointer",
              color: "#dc2626",
              fontWeight: 500,
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        {/* ── Search view ── */}
        {view === "search" && (
          <div style={{ padding: 20, height: "100%", overflowY: "auto" }}>
            <input
              placeholder="Search codes, descriptions, quotes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                fontSize: 15,
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                background: "#fff",
                color: "#111827",
              }}
            />
            {results.length > 0 && (
              <div style={{ marginTop: 16 }}>
                {results.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      marginBottom: 10,
                      padding: "12px 16px",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelected({ themeId: c.themeId, codeId: c.id });
                      setExpandedThemes((prev) => ({
                        ...prev,
                        [c.themeId]: true,
                      }));
                      setView("browse");
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        marginBottom: 2,
                      }}
                    >
                      {c.themeName}
                    </div>
                    <div style={{ fontWeight: 500 }}>{c.code}</div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#6b7280",
                        marginTop: 3,
                        lineHeight: 1.5,
                      }}
                    >
                      {c.desc.slice(0, 120)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Browse view ── */}
        {view === "browse" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "280px 1fr",
              height: "100%",
            }}
          >
            {/* Sidebar */}
            <div
              style={{
                borderRight: "1px solid #e5e7eb",
                overflowY: "auto",
                padding: "12px 0",
                background: "#fafafa",
              }}
            >
              {data.map((t, ti) => {
                const c = col(t.id);
                const isExpanded = expandedThemes[t.id];
                return (
                  <div key={t.id}>
                    <div
                      style={{
                        padding: "8px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        cursor: "pointer",
                        background:
                          selected.themeId === t.id && !selected.codeId
                            ? "#fff"
                            : "transparent",
                      }}
                      onClick={() => {
                        setSelected({ themeId: t.id, codeId: null });
                        setExpandedThemes((prev) => ({
                          ...prev,
                          [t.id]: !prev[t.id],
                        }));
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          color: "#9ca3af",
                          width: 12,
                          textAlign: "center",
                        }}
                      >
                        {isExpanded ? "▼" : "▶"}
                      </span>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: c.border,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          flex: 1,
                          lineHeight: 1.2,
                        }}
                      >
                        {t.theme}
                      </span>
                      <div style={{ display: "flex", gap: 2 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveTheme(ti, -1);
                          }}
                          disabled={ti === 0}
                          style={{
                            fontSize: 10,
                            padding: "2px 4px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            opacity: ti === 0 ? 0.2 : 0.6,
                          }}
                        >
                          ↑
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveTheme(ti, 1);
                          }}
                          disabled={ti === data.length - 1}
                          style={{
                            fontSize: 10,
                            padding: "2px 4px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            opacity: ti === data.length - 1 ? 0.2 : 0.6,
                          }}
                        >
                          ↓
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTheme(t.id);
                          }}
                          style={{
                            fontSize: 10,
                            padding: "2px 4px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "red",
                            opacity: 0.6,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ paddingLeft: 24 }}>
                        {t.codes.map((c2, ci) => (
                          <div
                            key={c2.id}
                            style={{
                              padding: "6px 10px",
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              cursor: "pointer",
                              background:
                                selected.codeId === c2.id
                                  ? "#eff6ff"
                                  : "transparent",
                            }}
                            onClick={() =>
                              setSelected({ themeId: t.id, codeId: c2.id })
                            }
                          >
                            <span
                              style={{
                                fontSize: 12,
                                color:
                                  selected.codeId === c2.id
                                    ? "#1d4ed8"
                                    : "#6b7280",
                                flex: 1,
                                lineHeight: 1.2,
                              }}
                            >
                              {c2.code}
                            </span>
                            <div style={{ display: "flex", gap: 2 }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveCode(t.id, ci, -1);
                                }}
                                disabled={ci === 0}
                                style={{
                                  fontSize: 9,
                                  padding: "2px 3px",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  opacity: ci === 0 ? 0.2 : 0.5,
                                }}
                              >
                                ↑
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveCode(t.id, ci, 1);
                                }}
                                disabled={ci === t.codes.length - 1}
                                style={{
                                  fontSize: 9,
                                  padding: "2px 3px",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  opacity:
                                    ci === t.codes.length - 1 ? 0.2 : 0.5,
                                }}
                              >
                                ↓
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteCode(t.id, c2.id);
                                }}
                                style={{
                                  fontSize: 9,
                                  padding: "2px 3px",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "red",
                                  opacity: 0.5,
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}

                        <div style={{ padding: "8px 10px" }}>
                          {addingCode === t.id ? (
                            <div
                              style={{
                                background: "#fff",
                                borderRadius: 8,
                                padding: 10,
                                border: "1px solid #e5e7eb",
                              }}
                            >
                              <input
                                placeholder="Code name"
                                value={newCodeName}
                                onChange={(e) => setNewCodeName(e.target.value)}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  fontSize: 12,
                                  padding: "5px 8px",
                                  borderRadius: 5,
                                  border: "1px solid #d1d5db",
                                  marginBottom: 6,
                                }}
                              />
                              <textarea
                                placeholder="Description"
                                value={newCodeDesc}
                                onChange={(e) => setNewCodeDesc(e.target.value)}
                                rows={2}
                                style={{
                                  width: "100%",
                                  boxSizing: "border-box",
                                  fontSize: 12,
                                  padding: "5px 8px",
                                  borderRadius: 5,
                                  border: "1px solid #d1d5db",
                                  resize: "vertical",
                                  marginBottom: 6,
                                }}
                              />
                              <div style={{ display: "flex", gap: 6 }}>
                                <button
                                  onClick={() => addCode(t.id)}
                                  style={{
                                    fontSize: 11,
                                    padding: "4px 10px",
                                    borderRadius: 5,
                                    background: "#eff6ff",
                                    border: "none",
                                    color: "#1d4ed8",
                                    cursor: "pointer",
                                  }}
                                >
                                  Add
                                </button>
                                <button
                                  onClick={() => setAddingCode(null)}
                                  style={{
                                    fontSize: 11,
                                    padding: "4px 10px",
                                    borderRadius: 5,
                                    background: "transparent",
                                    border: "1px solid #d1d5db",
                                    color: "#6b7280",
                                    cursor: "pointer",
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setAddingCode(t.id)}
                              style={{
                                fontSize: 11,
                                color: "#9ca3af",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                              }}
                            >
                              + add code
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div style={{ padding: "8px 14px" }}>
                {addingTheme ? (
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 8,
                      padding: 10,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <input
                      placeholder="Theme name"
                      value={newThemeName}
                      onChange={(e) => setNewThemeName(e.target.value)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        fontSize: 12,
                        padding: "5px 8px",
                        borderRadius: 5,
                        border: "1px solid #d1d5db",
                        marginBottom: 6,
                      }}
                    />
                    <textarea
                      placeholder="Theme description"
                      value={newThemeDesc}
                      onChange={(e) => setNewThemeDesc(e.target.value)}
                      rows={2}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        fontSize: 12,
                        padding: "5px 8px",
                        borderRadius: 5,
                        border: "1px solid #d1d5db",
                        resize: "vertical",
                        marginBottom: 6,
                      }}
                    />
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={addTheme}
                        style={{
                          fontSize: 11,
                          padding: "4px 10px",
                          borderRadius: 5,
                          background: "#eff6ff",
                          border: "none",
                          color: "#1d4ed8",
                          cursor: "pointer",
                        }}
                      >
                        Add Theme
                      </button>
                      <button
                        onClick={() => setAddingTheme(false)}
                        style={{
                          fontSize: 11,
                          padding: "4px 10px",
                          borderRadius: 5,
                          background: "transparent",
                          border: "1px solid #d1d5db",
                          color: "#6b7280",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingTheme(true)}
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      background: "none",
                      border: "1px dashed #d1d5db",
                      borderRadius: 6,
                      cursor: "pointer",
                      padding: "6px 12px",
                      width: "100%",
                    }}
                  >
                    + add new theme
                  </button>
                )}
              </div>
            </div>

            {/* Main panel */}
            <div
              style={{
                overflowY: "auto",
                padding: "24px 40px",
                background: "#fff",
              }}
            >
              {!selected.themeId && (
                <div
                  style={{
                    textAlign: "center",
                    color: "#9ca3af",
                    marginTop: 80,
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 12 }}>◈</div>
                  <div
                    style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}
                  >
                    Select a theme or code
                  </div>
                </div>
              )}

              {selTheme && !selCode && (
                <div>
                  <div
                    style={{
                      display: "inline-block",
                      fontSize: 11,
                      fontWeight: 500,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: col(selTheme.id).bg,
                      color: col(selTheme.id).text,
                      border: `1px solid ${col(selTheme.id).border}`,
                      marginBottom: 14,
                    }}
                  >
                    Theme
                  </div>
                  <EditField
                    label="Theme name"
                    value={selTheme.theme}
                    fieldKey="theme"
                  />
                  <EditField
                    label="Theme description"
                    value={selTheme.themeDesc}
                    fieldKey="themeDesc"
                    multiline
                  />
                  <div
                    style={{
                      marginTop: 20,
                      fontSize: 12,
                      color: "#6b7280",
                      fontWeight: 500,
                      marginBottom: 10,
                    }}
                  >
                    {selTheme.codes.length} codes in this theme
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: 10,
                    }}
                  >
                    {selTheme.codes.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelected({ themeId: selTheme.id, codeId: c.id });
                          setExpandedThemes((prev) => ({
                            ...prev,
                            [selTheme.id]: true,
                          }));
                        }}
                        style={{
                          padding: "12px 14px",
                          borderRadius: 8,
                          border: "1px solid #e5e7eb",
                          background: "#fff",
                          cursor: "pointer",
                          transition: "border-color 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.borderColor = col(
                            selTheme.id
                          ).border)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.borderColor = "#e5e7eb")
                        }
                      >
                        <div
                          style={{
                            fontWeight: 500,
                            fontSize: 13,
                            marginBottom: 4,
                            lineHeight: 1.4,
                          }}
                        >
                          {c.code}
                        </div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>
                          {c.quotes.length} quote
                          {c.quotes.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selCode && selTheme && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: col(selTheme.id).bg,
                        color: col(selTheme.id).text,
                        border: `1px solid ${col(selTheme.id).border}`,
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setSelected({ themeId: selTheme.id, codeId: null })
                      }
                    >
                      {selTheme.theme}
                    </div>
                    <span style={{ color: "#9ca3af", fontSize: 12 }}>›</span>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Code</div>
                  </div>

                  <EditField
                    label="Code name"
                    value={selCode.code}
                    fieldKey="code"
                  />
                  <EditField
                    label="Description / definition"
                    value={selCode.desc}
                    fieldKey="desc"
                    multiline
                  />

                  <div style={{ marginTop: 20 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#6b7280",
                        marginBottom: 10,
                      }}
                    >
                      Representative quotes ({selCode.quotes.length})
                    </div>
                    {selCode.quotes.map((q, i) => (
                      <div
                        key={i}
                        style={{
                          marginBottom: 10,
                          padding: "12px 14px",
                          borderRadius: 8,
                          background: "#f9f9f9",
                          border: "1px solid #eee",
                          fontSize: 13,
                          lineHeight: 1.6,
                        }}
                      >
                        {editingQuoteIndex === i ? (
                          <div>
                            <textarea
                              value={editQuoteVal}
                              onChange={(e) => setEditQuoteVal(e.target.value)}
                              rows={3}
                              style={{
                                width: "100%",
                                boxSizing: "border-box",
                                fontSize: 13,
                                padding: 8,
                                borderRadius: 6,
                                border: "1px solid #d1d5db",
                                marginBottom: 6,
                              }}
                            />
                            <div style={{ display: "flex", gap: 8 }}>
                              <button
                                onClick={() => saveQuote(i)}
                                style={{
                                  fontSize: 11,
                                  padding: "4px 10px",
                                  borderRadius: 5,
                                  background: "#eff6ff",
                                  border: "none",
                                  color: "#1d4ed8",
                                  cursor: "pointer",
                                }}
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingQuoteIndex(null)}
                                style={{
                                  fontSize: 11,
                                  padding: "4px 10px",
                                  borderRadius: 5,
                                  background: "transparent",
                                  border: "1px solid #d1d5db",
                                  color: "#6b7280",
                                  cursor: "pointer",
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: 12 }}>
                            <div style={{ flex: 1 }}>{q}</div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 4,
                              }}
                            >
                              <div style={{ display: "flex", gap: 2 }}>
                                <button
                                  onClick={() => moveQuote(i, -1)}
                                  disabled={i === 0}
                                  title="Move up"
                                  style={{
                                    fontSize: 10,
                                    padding: "2px 4px",
                                    borderRadius: 4,
                                    border: "1px solid #ddd",
                                    background: "#fff",
                                    cursor: i === 0 ? "default" : "pointer",
                                    opacity: i === 0 ? 0.3 : 1,
                                  }}
                                >
                                  ↑
                                </button>
                                <button
                                  onClick={() => moveQuote(i, 1)}
                                  disabled={i === selCode.quotes.length - 1}
                                  title="Move down"
                                  style={{
                                    fontSize: 10,
                                    padding: "2px 4px",
                                    borderRadius: 4,
                                    border: "1px solid #ddd",
                                    background: "#fff",
                                    cursor:
                                      i === selCode.quotes.length - 1
                                        ? "default"
                                        : "pointer",
                                    opacity:
                                      i === selCode.quotes.length - 1 ? 0.3 : 1,
                                  }}
                                >
                                  ↓
                                </button>
                              </div>
                              <div style={{ display: "flex", gap: 2 }}>
                                <button
                                  onClick={() => {
                                    setEditingQuoteIndex(i);
                                    setEditQuoteVal(q);
                                  }}
                                  title="Edit"
                                  style={{
                                    fontSize: 10,
                                    padding: "2px 4px",
                                    borderRadius: 4,
                                    border: "1px solid #ddd",
                                    background: "#fff",
                                    cursor: "pointer",
                                  }}
                                >
                                  ✎
                                </button>
                                <button
                                  onClick={() => deleteQuote(i)}
                                  title="Delete"
                                  style={{
                                    fontSize: 10,
                                    padding: "2px 4px",
                                    borderRadius: 4,
                                    border: "1px solid #ddd",
                                    background: "#fff",
                                    cursor: "pointer",
                                    color: "red",
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <div style={{ marginTop: 10 }}>
                      <textarea
                        placeholder="Add a new quote..."
                        value={newQuote}
                        onChange={(e) => setNewQuote(e.target.value)}
                        rows={3}
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          fontSize: 13,
                          padding: 10,
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          resize: "vertical",
                        }}
                      />
                      <button
                        onClick={addQuote}
                        style={{
                          marginTop: 6,
                          fontSize: 12,
                          padding: "8px 20px",
                          borderRadius: 6,
                          background: "#eff6ff",
                          border: "none",
                          color: "#1d4ed8",
                          cursor: "pointer",
                        }}
                      >
                        Add quote
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

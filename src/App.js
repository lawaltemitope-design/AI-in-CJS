import { useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
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
        desc: "This code concerns the use of AI to automate routine or administrative tasks in policing, with the aim of reducing workforce demand and enabling officers to focus on core operational duties.",
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
          `"We're quite excited about the opportunities [AI presents] but we can't really understand it at the moment" (Interview 5)`,
          `"When I hear the word AI… I probably think of new opportunities" (Interview 22)`,
        ],
      },
      {
        id: "c17",
        code: "Scepticism and fear",
        desc: "This code captures references to doubts, apprehensions, or negative emotions regarding the use of AI in policing and the criminal justice system.",
        quotes: [
          `"AI is a term that scares some people in law enforcement" (Interview 1)`,
          `"Policing is really quite sceptical. We do like our technology, I think it's fair to say, we do like the potential of it, but we also have a very healthy curiosity and caution around exactly how does it work and what are the risks and what are the benefits" (Interview 5)`,
          `"people do find [AI] a bit scary partly because they find tech scary generally" (Interview 15)`,
          `"I'm concerned that summarisation tools will be used for drafting of court documents and I have concerns around that in terms of accountability" (Interview 17)`,
          `"I think [AI adoption] should be approached in a positively cautious way" (Interview 23)`,
          `"It's about speeding everything up and I find that in almost every regard, especially in serious cases where there's a lot of material, there's no substitute for putting in the hard work and shortcuts are a worry to me" (Interview 25)`,
        ],
      },
      {
        id: "c18",
        code: "Historical parallels",
        desc: "This code captures references to comparisons between current AI adoption in policing and past technologies, policies, or innovations.",
        quotes: [
          `"I think if you look back to all the advances in policing, so fingerprints and DNA and CCTV and all those kind of things, I'm sure there was concerns around the introduction of those as well." (Interview 1)`,
          `"It will be like the mobile phone journey which started like this and now we're into this" (Interview 24)`,
          `"Before that, we're probably going back to DNA in the early nineties to look at what was brand new" (Interview 25)`,
        ],
      },
      {
        id: "c19",
        code: "Hands-on Experience",
        desc: "This code captures respondents' direct interactions with AI tools, including frequency, duration, and operational contexts.",
        quotes: [
          `"I am still trying to get my head around what [AI] actually means, what it's potential are and what the risks are. I have, unashamedly…started to play with it." (Interview 5)`,
          `"I use [Copilot] quite a lot to give me a framework if I'm writing a strategy." (Interview 6)`,
          `"I use Copilot daily and I use it to write terms of references." (Interview 21)`,
          `"The AI that I use in my current role is Copilot, so we'll use Copilot for meeting minutes" (Interview 22)`,
          `"I had a really good, interesting case recently which I chose to test the Adobe AI Reader on" (Interview 25)`,
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
        ],
      },
      {
        id: "c_det_prob",
        code: "Deterministic vs. probabilistic AI",
        desc: "This code captures respondents' distinction between deterministic AI and probabilistic generative AI.",
        quotes: [
          `"having some language to explain a more controlled and constrained application of AI where the results are more binary... versus something where you could ask it anything and it would give you any answer" (Interview 14)`,
          `"You either accept that [the probabilistic tool is]…going to be useful but imperfect, or you say well no, because it can't possibly be deterministic" (Interview 16)`,
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
        ],
      },
      {
        id: "c23",
        code: "Human in the Loop",
        desc: "This code captures information about the role of human oversight, intervention, and judgment in AI-supported decision-making processes.",
        quotes: [
          `"whilst we're saying humans in the loop are making the decisions in respect of what the outputs it gives you you've got to still do checks and balances in respect of it" (Interview 8)`,
          `"There needs to be a charging decision made by a human." (Interview 10)`,
          `"A developer said to me if you're not careful your human over the loop quite easily becomes your human scapegoat for poorly designed systems" (Interview 17)`,
          `"I want us to ban the term 'human in the loop' 'cause I think it's entirely meaningless" (Interview 19)`,
          `"We did a bit of testing…one of the things that we did find is that the human in the loop wasn't necessarily picking up on some of these key embellishments and hallucinations" (Interview 22)`,
        ],
      },
      {
        id: "c_comp_dom",
        code: "Comparison with other domains",
        desc: "This code captures correlation as well as lessons that can be learnt from other domains in respect of responsible use of AI.",
        quotes: [
          `"There's a project with responsible AI where the NHS are providing AI champions across all their NHS domains" (Interview 8)`,
          `"DNA was the subject of all these challenges and the EncroChat, that's why I mentioned it" (Interview 25)`,
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
        desc: "Challenges related to AI system performance, accuracy, reliability, or integration with existing infrastructure.",
        quotes: [
          `"The first and biggest challenge at the moment is that the [COPPA] AI library as we call it is static, so you have to manually update it" (Interview 12)`,
          `"Actually the automatic speech recognition technology within OpenAI, et cetera just isn't sophisticated enough to deal with the noisy environments that they're being deployed in" (Interview 19)`,
          `"The technical limitations with Copilot for now [are] that it can't feed into all these other systems outside of M365." (Interview 21)`,
        ],
      },
      {
        id: "c25",
        code: "Pace of development and fragmented rollout",
        desc: "Concerns about a fragmented and inefficient rollout of AI without sufficient guidance, and the rapid pace of technological change.",
        quotes: [
          `"one of our challenges here…is that the technology is moving at a breathtaking pace and it's really difficult for us to keep up" (Interview 5)`,
          `"[Tools used by police forces are] so fragmented its bonkers" (Interview 11)`,
          `"I'm pretty worried about the scale and the pace of [AI deployment] happening too quickly without regulatory frameworks" (Interview 23)`,
        ],
      },
      {
        id: "c26",
        code: "Unused Materials and Disclosure Issues",
        desc: "Challenges related to managing, retaining, and disclosing materials that are not actively used in investigations or prosecutions.",
        quotes: [
          `"What using AI has done is generate more unused material, so you've got the audio, the conversation is being recorded, that's unused material." (Interview 2)`,
          `"There is a legal obligation on CPS to review both [the summary and the full transcription] and then there is a legal obligation on CPS to disclose both to the defence potentially" (Interview 21)`,
        ],
      },
      {
        id: "c27",
        code: "Evidential chain risks and legalities",
        desc: "Potential risks, challenges, or legal considerations associated with the handling, transfer, and use of evidence processed or generated by AI systems.",
        quotes: [
          `"I would have said don't use AI and anything that's in the evidential chain" (Interview 9)`,
          `"[On the RVR AI trial], we had to pause our trial and engage with CPS…[The lesson learned was that] we should have engaged with CPS sooner" (Interview 9)`,
        ],
      },
      {
        id: "c28",
        code: "Data Quality and Availability",
        desc: "Difficulties arising from incomplete, biased, or inaccessible datasets necessary for AI training and operation.",
        quotes: [
          `"the challenge sometimes is around our availability of data and what we will share and what we won't share and also if we're using our datasets the bias that's already in there around our policing dataset" (Interview 8)`,
          `"What is also hugely problematic…is data quality" (Interview 7)`,
        ],
      },
      {
        id: "c29",
        code: "Skills gap and understanding deficiencies",
        desc: "Constraints related to staffing, skills, training, expertise, or institutional readiness to implement AI effectively.",
        quotes: [
          `"The biggest thing overall from an AI space, but this is broader in the digital element anyway, is skills and the lack of knowledge" (Interview 8)`,
          `"The vast majority of senior police officers have very little technical knowledge when it comes to technology or AI" (Interview 5)`,
          `"People have inflated ideas of what AI is... and it feels like a recipe for automation bias" (Interview 13)`,
        ],
      },
      {
        id: "c30",
        code: "Over-reliance / de-skilling",
        desc: "The dangers of overreliance on AI outputs which could lead to de-skilling and other severe consequences.",
        quotes: [
          `"overreliance on this technology will cause atrophy in skills that would otherwise have been used" (Interview 3)`,
          `"ultimately what we don't want is further down the line to completely deskill a workforce" (Interview 2)`,
          `"We refer to [it] as deskilling, so that goes back to almost that business continuity thing" (Interview 18)`,
        ],
      },
      {
        id: "c31",
        code: "Legal and regulatory barriers",
        desc: "Challenges associated with compliance, compatibility, data access/retention, accountability, and navigating existing laws.",
        quotes: [
          `"There's definitely some challenges in terms of the way that artificial intelligence as a technology works and its compatibility with UK law" (Interview 11)`,
          `"The ultimate issue rule… an expert is not permitted to answer the ultimate issue in the case because that's for the jury to decide" (Interview 25)`,
        ],
      },
      {
        id: "c32",
        code: "Ethical and social concerns",
        desc: "Apprehensions regarding fairness, bias, transparency, and privacy.",
        quotes: [
          `"in respect of the data that we've got on our systems…individuals …need to understand the bias that could be employed within our environment" (Interview 8)`,
          `"We all need to remember why we are there and we're doing all of this not to save ourselves time and to be efficient but to get justice for members of the public" (Interview 21)`,
        ],
      },
      {
        id: "c33",
        code: "Accuracy and reliability",
        desc: "The correctness, precision, and dependability of AI outputs or predictions.",
        quotes: [
          `"there's still a lot of work to do…particularly around levels of model accuracy that constitute good enough within a policing context" (Interview 3)`,
          `"We're using Copilot within the Home Office and…it shows a lot of the problems around irresponsible use, because it's often hallucinating rubbish" (Interview 3)`,
          `"When it comes to legal research tools my training says assume it's wrong." (Interview 15)`,
          `"We know there is hallucinations. So, for now we say you can use Copilot but you cannot use it with casework" (Interview 18)`,
        ],
      },
      {
        id: "c34",
        code: "'Black box' problem",
        desc: "The opacity of AI systems, where the internal logic, decision-making processes, or predictive mechanisms are not easily understandable or interpretable by users.",
        quotes: [
          `"one of the challenges [is] that as [AI] becomes more complicated, we understand it less" (Interview 5)`,
          `"There's a risk around black box, so things being shown to forces that look very, very attractive but where you can't actually see what the code is" (Interview 7)`,
          `"I've never been able to find out of these commercial vendors what their LLMs have been trained on. Very, very opaque" (Interview 20)`,
        ],
      },
    ],
  },
  {
    id: "t4",
    theme: "Chaining",
    themeDesc:
      "This theme captures information about the interaction and interdependence of multiple AI systems.",
    codes: [
      {
        id: "c39",
        code: "System interdependencies",
        desc: "Information about how different AI tools or systems are connected and influence one another.",
        quotes: [
          `"I think [chaining is] very limited because a lot of these AI development is still fairly young and fairly embryonic" (Interview 5)`,
          `"I'm not aware of any [chaining of AI systems]...I think there's a lot of nervousness across forces about anything like that" (Interview 7)`,
          `"Not yet [has chaining occurred]. I think it's too early." (Interview 21)`,
        ],
      },
      {
        id: "c40",
        code: "Compounding errors",
        desc: "Information about how inaccuracies or biases in one system may propagate through linked AI systems.",
        quotes: [
          `"If we don't illuminate [transcription accuracy concerns] and we just assume the transcription is accurate, then potentially everything else could become biased that follows." (Interview 20)`,
          `"That would be like AI training AI and not having a bedrock of data sufficiently wide enough to train the first tool." (Interview 24)`,
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
        ],
      },
      {
        id: "c42",
        code: "AI benefits beyond time savings",
        desc: "This code captures information on the need to extend AI benefits beyond mere time savings to other, more impactful outcomes.",
        quotes: [
          `"policing are tending to look for time savings and efficiencies and they're not always there to be had" (Interview 9)`,
          `"[with vigil AI], you are reducing the need for people to look at extremely unpleasant images" (Interview 16)`,
        ],
      },
      {
        id: "c43",
        code: "Improved quality and consistency",
        desc: "This code captures references to improvements in the quality, reliability, or consistency of outputs.",
        quotes: [
          `"[Anathem] allows the officer to ensure that those points to prove have been coordinated" (Interview 2)`,
          `"I sometimes throw it through Copilot to say can you just redraft or make it more empathetic or take the harshness out of it" (Interview 18)`,
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
        desc: "This code captures information about AI's contribution to more informed, accurate, or timely decisions.",
        quotes: [
          `"The power always remains with the human at the end of it, but it's our job to try to give them the tools and the access to the expertise that they need" (Interview 5)`,
          `"[LATIS] provides the human with a way of structuring and prioritising… where do they focus their limited time" (Interview 23)`,
        ],
      },
      {
        id: "c47",
        code: "Reliance on AI in Decision-Making",
        desc: "This code captures information about the extent to which professionals depend on AI outputs when making operational or strategic decisions.",
        quotes: [],
      },
      {
        id: "c48",
        code: "Resource Optimisation",
        desc: "This code captures information about how AI supports better allocation of personnel, funding, or other organisational resources.",
        quotes: [
          `"In our tasking unit I think [AI] could really support the distribution of work, the allocation of casework" (Interview 24)`,
        ],
      },
      {
        id: "c49",
        code: "Innovation and Experimentation",
        desc: "This code captures information about AI enabling new approaches, pilot projects, or creative solutions within policing.",
        quotes: [
          `"I think there is more innovation than we think" (Interview 19)`,
          `"Not only did we want to develop AI to help solve the problem that we have, but also we wanted to understand what would be the difference between us designing and building it and versus going out and buying something commercially" (Interview 20)`,
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
        ],
      },
      {
        id: "c57",
        code: "Vendor and Stakeholder Management",
        desc: "This code captures interactions, responsibilities, or collaborations with technology providers, funders, or other external stakeholders in AI projects.",
        quotes: [],
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
        ],
      },
      {
        id: "c60",
        code: "Public participation and policing by consent",
        desc: "This code captures information about the importance of including the public in decisions about AI deployment in policing.",
        quotes: [
          `"[We] need to include the public at all stages which looks at the importance of public participation from the perspective of legitimacy, democratic accountability and the principle of policing by consent" (Interview 17)`,
        ],
      },
    ],
  },
  {
    id: "t7",
    theme: "Funding and innovation",
    themeDesc:
      "This theme captures information about the financial resources, investment mechanisms, and innovation processes that enable the initiation, development, and scaling of AI projects.",
    codes: [
      {
        id: "c61",
        code: "Sources of Funding",
        desc: "This code captures information about the origins of financial support for AI projects.",
        quotes: [
          `"We [PCSA] are funding projects associated with AI…we have two funding streams…one is the STAR fund" (Interview 8)`,
          `"Home Office…give money to bits of policing to procure it for policing" (Interview 3)`,
        ],
      },
      {
        id: "c62",
        code: "Innovation pipeline stages",
        desc: "Projects typically move through an innovation pipeline, starting with exploratory phase, then progressing to blueprinting and requiring evaluation before national rollout.",
        quotes: [
          `"Most of them are within the exploratory phase…they then go for blueprinting and they need an evaluation" (Interview 8)`,
          `"We have an innovation map, so we know all of the different innovations that the forces are doing" (Interview 8)`,
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
        quotes: [],
      },
      {
        id: "c68",
        code: "Partnerships and Collaborations",
        desc: "This code captures information about collaboration with other police forces, vendors, academia, or other agencies.",
        quotes: [
          `"Some [police forces] will be building them [AI tools] off with the usual IT companies" (Interview 8)`,
          `"as a region [the Eastern Region Innovation Network], we can actually be more efficient and work together to do things once" (Interview 9)`,
        ],
      },
      {
        id: "c69",
        code: "Scaling and Sustainability",
        desc: "This code captures information about efforts to expand successful AI projects, maintain funding, or ensure long-term viability.",
        quotes: [
          `"We set up [the Eastern Region Innovation Network] three years ago…to share best practice, research and innovation [across seven police forces in the Eastern Region]" (Interview 9)`,
          `"[We need to understand] how do you do joint data control agreements" (Interview 20)`,
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
        ],
      },
      {
        id: "c76",
        code: "Ethical and Risk Considerations",
        desc: "This code captures forward-looking concerns about fairness, bias, accountability, and risk management.",
        quotes: [
          `"The list [of potential applications] is probably endless, to be honest, but I suppose it's although we could whether we should, is the question, isn't it?" (Interview 8)`,
          `"I'm not looking at these from an efficiency saving point of view... the whole thing should be based around getting a better result for people" (Interview 21)`,
        ],
      },
      {
        id: "c77",
        code: "Cautious and Iterative Deployment",
        desc: "This code captures recommendations for a cautious, iterative deployment of AI, particularly when it impacts critical legal processes.",
        quotes: [
          `"I would suggest that we hold a lot of data in policing so there are ways in which we could use retrospective data to be able to test something before making it go live" (Interview 9)`,
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
        ],
      },
      {
        id: "c79",
        code: "Long-term outlook for policing",
        desc: "This code captures information about broad assessments of the trajectory of AI in law enforcement.",
        quotes: [
          `"policing is always going to be a long time. They're lagged in the grand scheme of things" (Interview 3)`,
          `"AI has huge, huge potential in law enforcement but I think that there are a number of challenges and barriers right now" (Interview 20)`,
        ],
      },
      {
        id: "c80",
        code: "Focus on foundational AI integration",
        desc: "This code captures attention to establishing core AI capabilities and infrastructure as a necessary step before pursuing more advanced applications.",
        quotes: [
          `"From my perspective I'd like to start with the low hanging fruit" (Interview 3)`,
          `"I think we have loads of the technology that can be used...it's about orchestrating it and pulling it together" (Interview 16)`,
        ],
      },
      {
        id: "c81",
        code: "Consolidation of policing landscape",
        desc: "This code captures references to efforts aimed at reducing fragmentation within policing structures.",
        quotes: [
          `"The Home Secretary…plans to reform the policing structures in England and Wales" (Interview 3)`,
          `"Our ambitions are for it [procurement] not to be done in a silo and to be done centrally and done well once in a centre" (Interview 19)`,
        ],
      },
      {
        id: "c82",
        code: "System integration (Voice/PNC)",
        desc: "This code captures the future goal of integrating AI with force databases to allow for voice-activated checks.",
        quotes: [
          `"future iterations [of the COPPA AI tool] would see this integrated with your force systems... you could say can you do a PNC check for me on Joe Blogs" (Interview 12)`,
        ],
      },
      {
        id: "c83",
        code: "Scepticism regarding generative drafting",
        desc: "This code captures doubts about whether generative AI tools deliver genuine efficiency savings in drafting and document preparation.",
        quotes: [
          `"Can it write a statement for me... I'm not a great advocate of that, personally" (Interview 12)`,
          `"I think that everybody looks for efficiency. I haven't seen efficiency yet" (Interview 21)`,
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

  // ── FIX: only seed Firestore if the document does not already exist ──
  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, "workbench", "mainData");

    getDoc(docRef).then((snap) => {
      if (!snap.exists() || !snap.data().themes) {
        setDoc(docRef, { themes: safeData });
      }
    });

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

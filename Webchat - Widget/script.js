var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList



const socket = io("http://localhost:5005");

const recognition = new SpeechRecognition();
const rec = new SpeechRecognition();
var synth = window.speechSynthesis;
var x=0;
const leo = "ok leo";
var recognitionList = new SpeechGrammarList();
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const chat = document.getElementById('boxi');

const messageInput = document.getElementById('message-input');

// recognitionList.addFromString(grammar, 1);
recognition.lang = 'it-IT';
recognition.interimResults = false;
recognition.continuos = false;
// recognition.grammar = recognitionList;
recognition.maxAlternative = 3;

recognition.start();





	recognition.onspeechstart = () => {
        
	
		
		recognition.onresult = (event) => {
			console.log(event);
			var result = event.results[0][0].transcript.toLowerCase();
			
			if (result.includes("ok leo")){
				
			   if( x==0){
				openForm();
				
				}
				else{
				messageInput.value = result;
	              
				result = result.replace(/ok leo/g, " ");
	            
				result = result.replace(/ chiocciola /g, "@");

				if (result.includes("@")){
					result = result.replace(/ /g, "")
				}
	
				socket.emit('user_uttered', {
					"message": result,
				});
				messageInput.value = '';

	           
				appendMessageSend(result, "sent");

			}
				


			}else{
				recognition.abort();
				
			}
			 
        }

	   }


    recognition.onend = () =>{
		
		recognition.start();
	}


     
		


 function speackMessage(msg){

    var messagio = new SpeechSynthesisUtterance(msg)
	synth.speak(messagio);
	

 }

// function scrollToBottom() {
// 	window.scrollTo(0, document.getElementById("myForm").scrollHeight);
// }

function appendMessage(msg, type) {
	const item = document.createElement('div');
    item.textContent = msg;
	speackMessage(msg);
	item.classList.add("message");
	item.classList.add(`message_${type}`);
	messages.appendChild(item);
	

}


function appendMessageSend(msg, type){
	const item = document.createElement('div');
    item.textContent = msg;

	item.classList.add("message");
	item.classList.add(`message_${type}`);
	messages.appendChild(item);
	
}

// function appendImage(src, type) {
// 	const item = document.createElement('div');
// 	item.classList.add("message");
// 	item.classList.add(`message_${type}`);
// 	const img = document.createElement('img');
// 	img.src = src;
// 	img.onload = scrollToBottom;
// 	item.appendChild(img);
// 	messages.appendChild(item);
// }

// function appendQuickReplies(quickReplies) {

// 	const quickRepliesNode = document.createElement('div');

// 	quickRepliesNode.classList.add("quick-replies");


// 	quickReplies.forEach(quickReply => {
// 		const quickReplyDiv = document.createElement('button');

// 		speackMessage(quickReply.title);
// 		quickReplyDiv.innerHTML = quickReply.title;

// 		quickReplyDiv.classList.add("button");

// 		quickReplyDiv.addEventListener("click", () => {
// 			messages.removeChild(quickRepliesNode);
// 			appendMessageSend(quickReply.title, "sent");
// 			socket.emit('user_uttered', {
// 				"message": quickReply.payload,
// 			});
// 		})
// 		quickRepliesNode.appendChild(quickReplyDiv);
// 	})
// 	messages.appendChild(quickRepliesNode);

// 	scrollToBottom();
// }


function appendQuickReplies(quickReplies) {

	const quickRepliesNode = document.createElement('div');

	quickRepliesNode.classList.add("quick-replies");


	quickReplies.forEach(quickReply => {
		const quickReplyDiv = document.createElement('button');

		speackMessage(quickReply.title);
		quickReplyDiv.innerHTML = quickReply.title;

		quickReplyDiv.classList.add("quickreplies");

		quickReplyDiv.addEventListener("click", () => {
			messages.removeChild(quickRepliesNode);
			appendMessageSend(quickReply.title, "sent");
			socket.emit('user_uttered', {
				"message": quickReply.payload,
			});
		})


		quickRepliesNode.appendChild(quickReplyDiv);

	})

	messages.appendChild(quickRepliesNode);

    



}



function initPayload(start){
	x++;
		socket.emit('user_uttered', {
		"message": start,

   });
}

socket.on('connect', function () {
	//connessione effettuata

    console.log('Connessione effettuata');

});

socket.on('connect_error', (error) => {
	//scrive sulla console errore di connessione
	console.error(error);
});

// chat.addEventListener('click', () => {
// 	recMessage(recognition);
// })

form.onclick = (e) =>{



	e.preventDefault();
	const msg = messageInput.value;

	if (msg) {
		socket.emit('user_uttered', {
			"message": msg,
		});
		messageInput.value = '';

		appendMessageSend(msg, "sent");
	}
};



socket.on('bot_uttered', function (response) {
	
	console.log("Bot uttered:", response);
	
	
	if (response.text) {
		appendMessage(response.text, "received");



	}
	// // if (response.attachment) {
	// // 	appendImage(response.attachment.payload.src, "received");

	// }
	if (response.quick_replies) {
		appendQuickReplies(response.quick_replies);

	}

});




function openForm() {
	if (x==0){
	 initPayload(leo);	
	}
 
  document.getElementById("chatbot").style.display = "block";
  document.getElementById("open").style.display = "none";
  document.getElementById("close").style.display = "block";

  }

  function closeForm() {
  document.getElementById("chatbot").style.display = "none";
  document.getElementById("open").style.display = "block";
  document.getElementById("close").style.display = "none";
  }

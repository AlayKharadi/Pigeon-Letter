import { useEffect, useRef, useState } from 'react';
import './App.css';
import chatapp from './utils/chatapp';

function App() {
	const [user, setUser] = useState(undefined);
	const [msg, setMSG] = useState('');
	const [list, setList] = useState([]);
	const input = useRef(null);
	const msgList = useRef(null);

	//define what will happen when someone get a message from server.
	chatapp.onmessage = (event) => {
		let response = JSON.parse(event.data);
		setList([
			...list, {
				user: response.user,
				msg: response.msg
			}
		]);
	}

	//Update the MSG state of the application when someone enter something into the input field
	function changeMSG(e) {
		if (e.isTrusted) {
			e.preventDefault();
			setMSG(e.target.value);
		}
	}

	//Send the message to the appropriate user
	function sendMSG(e) {
		if (e.isTrusted && (msg !== '')) {
			e.preventDefault();
			setList([
				...list, {
					user: user,
					msg: msg
				}
			]);
			//if the socket is open then send the message to the server
			if (chatapp.readyState === chatapp.OPEN) {
				chatapp.send(JSON.stringify({
					user: user,
					msg: msg
				}));
			}
			//After message have been sent clear it
			setMSG('');
		}

		//after some click the send button maintain focus on input field
		input.current.focus();

		//Every time there is a new message make sure that the screen scroll to the last message
		msgList.current.addEventListener('DOMNodeInserted', event => {
			const { currentTarget: target } = event;
			target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
		});
	}

	//onload open a popup to enter the username
	useEffect(() => {
		let temp;
		while (!temp) {
			temp = prompt('Enter the user name');
		}
		setUser(temp);

		if (input) {
			input.current.focus();
		}
		return () => {
			return false;
		}
	}, []);

	return (
		<div className="App">
			<header className='title'>
				Pigeon-Letter
			</header>
			<ul
				className='messages'
				ref={msgList}
			>
				{
					(list.length > 0) && list.map((item, index) => {
						return (
							<li className={`message ${(item.user === user) ? 'sender' : 'reciever'}`} key={index}>
								<small>{item.user}</small>
								<hr />
								{item.msg}
							</li>
						)
					})
				}
			</ul>
			<div className='input-box'>
				<input
					name='msg'
					className='msg'
					type={'text'}
					ref={input}
					value={msg}
					onChange={(e) => changeMSG(e)}
					autoFocus={true}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							sendMSG(e);
						}
					}}
				/>
				<button
					onClick={(e) => sendMSG(e)}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path fillRule="evenodd" d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89.471-1.178-1.178.471L5.93 9.363l.338.215a.5.5 0 0 1 .154.154l.215.338 7.494-7.494Z" />
					</svg>
				</button>
			</div>
		</div>
	);
}

export default App;

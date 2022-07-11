import axios from 'axios';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';

function App() {
  const pusher = new Pusher("8c8c1f6d8d719dd3d233", {
    cluster: "ap3"
  })

  const [chats, setChats] = useState([])
  const [onlineUserCount, setOnlineUserCount] = useState()
  const [text, setText] = useState("")

  // useEffect 안에 적을 것 = 클래스형 컴포넌트의 componentDidMount()의 역할
  useEffect(() => {
    // subscribe(연결)
    const channel = pusher.subscribe('chat')

    // channel.bind("pusher:subscription_succeeded", (members) => {
    //   console.log("count", members.count)
    // })

    // channel.bind("pusher:member_added", (member) => {
    //   console.log("add", channel.members.count)
    // })

    // 서버에서 메시지 생성 후 response => 받은 데이터를 chats에 추가
    channel.bind("create-message", data => {
      const { username, message } = data
      setChats((prev) => [
        ...prev, { username, message }
      ])
    })
  }, [])

  // 메시지 전송 버튼 클릭 => 서버로 데이터 전송
  const clickSendButton = async () => {
    const payload = {
        username: "정민",
        message: text
    };
  
    await axios.post('http://localhost:3000/pusher/messages', payload);
  }

  return (
    <div>
      <section>
        <div>
          <input
            placeholder="chat here..."
            onChange={ e => { setText(e.target.value) } }
          />
          <button onClick={ clickSendButton }>전송</button>
        </div>

        <ul>
          {chats.map((chat, index) => {
              return (
                  <div key={index}>
                      <strong>{chat.username}</strong>
                      <p>{chat.message}</p>
                  </div>
              );
          })}
        </ul>
      </section>
    </div>
  )
}

export default App;

import React, { useEffect, useRef, useState } from 'react'
import Input from '../../components/Input'
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';


const img1 = "https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg";

const Dashboard = () => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
    const [conversations, setConversations] = useState([])
    const [messages, setMessages] = useState({})
    const [message, setMessage] = useState('')
    const [users, setUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const messageRef = useRef(null);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('user:token');
        localStorage.removeItem('user:detail');
        navigate('/users/sign-in')
    }


    useEffect(() => {
        setSocket(io('http://localhost:8080'))
    }, [])

    useEffect(() => {
        socket?.emit('addUser', user?.id)
        socket?.on('getUsers', users => {
            console.log('activeUser', users);
        })
        socket?.on('getMessage', data => {
            setMessages(prev => ({
                ...prev,
                messages: [...prev.messages, {user: data.user, message: data.message}]
            }))
        })
    }, [socket, user?.id]);

    useEffect(() => {
        messageRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message?.message])
    
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user:detail'));
        const fetchConversations = async() => {
            const res = await fetch(`http://localhost:8000/api/conversation/${loggedInUser?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const resData = await res.json();
            setConversations(resData);
        }
        fetchConversations();
    }, []);

    useEffect(() => {
        const fetchUsers = async() => {
            const res = await fetch(`http://localhost:8000/api/users/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const resData = await res.json();
            setUsers(resData);
        }
        fetchUsers();
    }, [user?.id])

    const fetchMessages = async(conversationId, receiver) => {
        const res = await fetch(`http://localhost:8000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const resData = await res.json();
        console.log("resss", resData);
        setMessages({messages: resData, receiver, conversationId});
    }

    const sendMessage = async (e) => {
        socket.emit('sendMessage', {
            conversationId: messages?.conversationId,
            senderId: user?.id,
            message,
            receiverId: messages?.receiver?.receiverId
        });
        const res = await fetch(`http://localhost:8000/api/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversationId: messages?.conversationId,
                senderId: user?.id,
                message,
                receiverId: messages?.receiver?.receiverId
            })
        });
        setMessage('')
    } 

  return (
    <div className='w-screen flex'>
      <div className='w-[25%] h-screen bg-light  overflow-y-scroll'>
        <div className='flex items-center justify-cente mx-10 my-6'>
            <div className=''><img className='rounded-full ' width={50} src='https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg' alt='User' /></div>
            <div className='ml-4'>
                <h3 className='text-xl'>{user.fullname}</h3>
                <p className='font-light'>My Account</p>
            </div>
            {/* <div>Logout</div> */}
        </div>
        <hr />
        <div className='mx-10 mt-5'>
            <div className='text-primary text-lg '>Messages</div>
            <div>
                { conversations.length > 0 ?
                    conversations.map(({conversationId, user }) => {
                        return(
                            <div className='flex items-center justify-cente py-5 border-b border-b-gray-600'>
                                <div className='flex cursor-pointer items-center' onClick={() => fetchMessages(conversationId, user)}>
                                <div className=''><img className='rounded-full ' width={40} src={img1} alt='User' /></div>
                                <div className='ml-4'>
                                    <h3 className='text-lg font-semibold'>{user?.fullname}</h3>
                                    <p className='font-light text-sm text-gray-600'>{user?.email}</p>
                                </div>
                                </div>
                            </div>
                        )
                    }) : <div className='text-center text-lg font-semibold mt-10'>No Conversations</div>
                }
            </div>
        </div>
      </div>
      <div className='w-[50%] h-screen bg-white flex flex-col items-center'>
        { messages?.receiver?.fullname &&
                <div className='w-[75%] bg-light h-[80px] mt-10 rounded-full flex items-center px-6'>
                    <div className='cursor-pointer'><img className='rounded-full ' width={50} src='https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg' alt='User' /></div>
                    <div className='ml-4 mr-auto'>
                        <div className='text-lg'>{messages?.receiver?.fullname}</div>
                        <p className='text-sm font-light text-gray-600'>{messages?.receiver?.email}</p>
                    </div>
                    <div className='cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone-outgoing" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                        <path d="M15 9l5 -5" />
                        <path d="M16 4l4 0l0 4" />
                        </svg>
                    </div>
                </div>
        }
        <div className='h-[75%] w-full overflow-y-scroll border-b'>
            <div className=' p-10'>
                { messages?.messages?.length > 0 ? messages?.messages?.map(({message, user : {id} = {} }) => {
                        return (
                            <>
                                <div className={`max-w-[45%]  rounded-b-xl   py-2 px-4 mb-4 ${ id === user?.id ? "bg-primary rounded-tl-xl ml-auto text-white" : "bg-light rounded-tr-xl"}`}>{message}</div>
                                <div ref={messageRef}></div>
                            </>
                        )}) : <div className='text-center text-lg font-semibold mt-24'>No Messages or No Conversation Selected</div>
                }
             </div>
        </div>
        {
            messages?.receiver?.fullname &&
            <div className='p-10 w-full flex items-center'>
                <div className='w-full'>
                <Input placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} className='w-full p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none' />
                </div>
                <div className={`ml-4 cursor-pointer rounded-full bg-light p-4 shadow-md ${!message && "pointer-events-none"}`} onClick={() => sendMessage() }>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-send" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M10 14l11 -11" />
                        <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                    </svg>
                </div>
                <div className={`ml-4 cursor-pointer rounded-full bg-light p-4 shadow-md ${!message && "pointer-events-none"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-plus" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                        <path d="M9 12h6" />
                        <path d="M12 9v6" />
                    </svg>
                </div>
            </div>
        }
      </div>
      <div className='w-[25%] bg-light h-screen px-8 py-10 overflow-y-scroll'>
        <div className='flex items-center justify-between'>
        <div className='text-primary text-lg '>People</div>
        <div onClick={logout} className='flex items-center gap-2 font-semibold cursor-pointer'>Logout</div>
        </div>
        <div>
                { users.length > 0 ?
                    users.map(({userId, user }) => {
                        return(
                            <div className='flex items-center justify-cente py-5 border-b border-b-gray-600'>
                                <div className='flex cursor-pointer items-center' onClick={() => fetchMessages('new', user)}>
                                <div className=''><img className='rounded-full ' width={40} src={img1} alt='User' /></div>
                                <div className='ml-4'>
                                    <h3 className='text-lg font-semibold'>{user?.fullname}</h3>
                                    <p className='font-light text-sm text-gray-600'>{user?.email}</p>
                                </div>
                                </div>
                            </div>
                        )
                    }) : <div className='text-center text-lg font-semibold mt-10'>No Conversations</div>
                }
            </div>
      </div>
    </div>
  )
}

export default Dashboard

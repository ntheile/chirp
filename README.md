Chirp
==============

<img height="500px" src="https://raw.githubusercontent.com/ntheile/chicoinapp/master/src/assets/img/app.jpg"/>

Debug on web

`ionic serve`

Debug on android

`npm run android`

Deploy to android

`npm run deploy`

Proof of Attendance Algorithm
=============================
Proof of attendance uses BlueTooth/Audio to prove somebody is in attendance at an event. Unlike GPS (which can be spoofed), the algorithm proves you are there by other people “in the room” “seeing” you there.  A majority of people at the event need to confirm you are there. This data needs to be sent to a smart contract to calulate and come to consensus that you attended in a decentralized fashion and then fairly distrubte the tokens. Each Event must have a unique EventId. 

### Translated to Tech

Person =  public/ private key pair 

Saying "I'm Here! or PRESENT" = signing a message with the other parties public key
<pre>
{
	myPublicKey: 0x55738495h34iu534u9534njk,
	time: 8/16/2018 7:09:01 PM
}
</pre>

You need to broadcast your public key so all attendees can sign messages before they send them to you. This is to prevent fake attendees claiming they are somebody else (i.e. checking in your buddy).  Only signed messages are valid, others are ignored. This should prevent some forms of Sybil attack.

TODO - Are there other Attach Vectors??? (Time Clock Skew attacks, 51%, Sybil etc...)

### Test Case (Nick and Patrick)

####  "I'm Here!"

Lets say, Nick, enters an event with 10 people. When Nick walks in, he will probably receive 10 public keys (representing the 10 other people). He loops thru the 10 public keys and signs a message that he is "present". Nick's phone uses Google Nearby to broadcast the message to the 10 other people near him. 

#### "Hi! Ill add you to the Attendance List"
When Patrick receives a "Presence" request from Nick he decrypts the signed message proving it came from you (and not Ferris Bueller "sick" from home). Patrick adds Nick to his "attendance List". * Note - the Nearby api can filter out messages that are not intended for you (i.e. if its not signed to your public key). This will save on bandwidth, since NearBy broadcasts to everybody in the room via BLE/Audio but transmits the encrypted data via network. Eventually 
Patrick builds up a list with everybody, or most, people at the event. 

#### "Turn in the list to the smart contract"
At the end of the Event everybody will "turn in the attendance list" to the Smart Contract. The smart contract will tally everybodies lists and determine who was actually there. Let's say you need 26% confirmations to prove you attended the event. 


Nick

    I see Joel (Pub Key)
    I see Peter (Pub Key)
    I see Patrick (pub key)

Joel

    I see Nick (Pub Key)
    I see Peter (Pub Key)

Peter

    I see Nick (Pub Key)
    I see Patrick (pub key)

Patrick

    I see Nick (Pub Key)
    I see Peter (Pub Key)


### Smart Contract

    Nick = 3/4 => 75% => present +1 CHI
    Joel = 1/4 => 25% => not present 0 CHI
    Peter = 3/4 => present +1 CHI
    Patrick = 2/4 => present +1 CHI

What if you come in late?

The app uses Google NearBy, which is a foreground running process. If you come in late you may not get attendance credit if less than X% of the room is not using the app at that time. Therefore, we could make the app interactive and incentivise people to keep the app open during sessions. Maybe to ask question to a speaker? Or give tokens to a speaker for a good presentation? Or simple a thumbs up?


### Blockchain
We want to fairly distribute ("mine") the tokens to the attendees in a decentralized fashion. We do not want to have a centralized treasurer to manually disperse the tokens in a centralzied way. This could lead to stealing or corruption or stealing. 

Therefore, we must use a Smart Contract that can handle a high data load for low/no transaction fee (since the token has no tangible monetary value... at this point). The way the token distribution stays honest is the fact that the data comes from everyone at the event in a distributed fashion...not just one person (like the teacher) taking attendance.  

The only blockchain that I am aware of that can process this amount of data and transactions cheaply is EOS. The smart contract will need a few EOS tokens staked for the duration of the computation. The data can be stored as JSON in EOS's NoSQL storage after the event for a few hours hours or long enough for all the attedees to submit there lists (this should happen automatically when they close the app). After the event concludes and everybody submitted their request the smart contract can calcualte who attended and distribute the ChiCoin's to all who were present. After the event the data can be pruged from the EOS NoSQL stroage and the token's unstaked. It's FREE to run smart contracts. The only thing that needs payment is the initial EOS account for each attendee (it's free on the EOS Jungle Testnet). 

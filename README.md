# My_Zoom

Essayez l'appli <a href="https://shrouded-mesa-57032.herokuapp.com/" target="_blank">ici</a>

<h2><u>Concernant l'appli</u></h2>
<p>Sur cette appli vous pourrez créer des appels vidéos en groupe de la même manière que zoom (design calqué sur zoom également)</p>
<h4>Features</h4>
<p>-Créer des réunion par un formulaire (on doit entrer qu’un pseudo, l’ID de réunion et le mot de de passe sont générés automatiquement)</p>
<p>-Rejoindre des réunion par un formulaire (entrer l’ID et un pseudo),  ou par lien direct (pseudo par défaut)

<i>ajouter un champ mdp (à venir)</i>
<br /></p>
<p>-N'autoriser l'accès d’une réunion qu'après vérification des permissions micro et camera</p>
<p>-Possibilité de se mute et de couper la caméra</p>
<p>-Voir tous les participants</p>
<p>-Communiquer via un chat</p>
<p>-Droits admin à l'hôte de la réunion. Du genre expulser des gens, les mute etc... (à venir)</p>
<p>-Partager des fichiers par le chat (à venir)</p>
<p>-Effets sonores lorsque quelqu'un se mute, quitte la salle etc... (à venir)</p>
<p> les mdp por l'acces</p>

<h4>Un peu de détails concernant la partie technique</h4>
<p>-J'ai opté pour une stack JS, Node.js/Vue.js</p>
<p>-Pour les appels vidéos j'ai utilisé la bibliothèque <a href="https://peerjs.com/">Peer.js</a> et pour le chat et autres j'ai utilisé Socket.io</p>
<p>-Les données de réunions sont stockés dans une base de données MongoDB, les données utilisateur sont détruites aussitôt qu’un utilisateur quitte une réunion, et les données de réunions sont détruites de que tout le monde s’est déconnecte de celle-ci</p>

<b>/!\ veuillez m'informer de tout problème rencontrer lors de votre visite sur l'appli (incompatibilité navigateur, erreurs sur la console et…), merci !</b>

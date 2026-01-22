<?php
session_start();
require_once __DIR__ . "/path.php";

$url = $_SERVER['PATH_INFO'] ?? "";

switch($url) {
    case "":
        include_once ROOT . "index.php";
        break;
    case "/accessibilite":
        include_once ROOT . "accessibilite.php";
        break;
    case "/amis":
        include_once ROOT . "amis.php";
        break;
    case "/creationRoadTrip":
        include_once ROOT . "creationRoadTrip.php";
        break;
    case "/favoris.php":
        include_once ROOT . "favoris.php";
        break;
    case "/generate_shared_link":
        include_once ROOT . "generate_shared_link.php";
        break;
    case "/historique":
        include_once ROOT . "historique.php";
        break;
    case "/login":
        if($_SERVER['REQUEST_METHOD'] === 'GET') {
            include_once ROOT . "login.php";
        }else{
            include_once ROOTFORM . "form_connect.php";
        }
        break;
    case "/register":
        if($_SERVER['REQUEST_METHOD'] === 'GET') {
            include_once ROOT . "register.php";
        }else{
            include_once ROOTFORM . "form_register.php";
        }
        break;
    case "/logout":
        include_once ROOT . "logout.php";
        break;
    case "/mesRoadTrips":
        include_once ROOT . "mesRoadTrips.php";
        break;
    case "/messagerie":
        include_once ROOT . "messagerie.php";
        break;
    case "/profil":
        include_once ROOT . "profil.php";
        break;
    case "/public_road":
        include_once ROOT . "public_road.php";
        break;
    case "/reset_password":
        include_once ROOT . "reset_password.php";
        break;
    case "/Roadtrip":
        include_once ROOT . "Roadtrip.php";
        break;
    case "/shared":
        include_once ROOT . "shared.php";
        break;
    case "/vuRoadTrip":
        include_once ROOT . "vuRoadTrip.php";
        break;
    case "/page_link/cgu":
        include_once ROOTLINK . "cgu.php";
        break;
    case "/page_link/contact":
        include_once ROOTLINK . "contact.php";
        break;
    case "/page_link/cookie":
        include_once ROOTLINK . "cookie.php";
        break;
    case "/page_link/faq":
        include_once ROOTLINK . "faq.php";
        break;
    case "/page_link/politique":
        include_once ROOTLINK . "politique.php";
        break;
    case "/delete_RoadTrip":
        include_once ROOTFORM . "delete_RoadTrip.php";
        break;
    case "/send_mess":
        include_once ROOT . "messagerie/send_mess.php";
        break;
    case "/debut_conv":
        include_once ROOT . "messagerie/debut_conv.php";
        break;
    case "/get_mess":
        include_once ROOT . "messagerie/get_mess.php";
        break;
    default:
        echo "404 Not Found";
        break;

}



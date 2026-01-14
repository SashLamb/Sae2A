<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    $ville_choisie = $_POST['ville_destination']; 
    
    echo "L'étape $ville_choisie a été ajoutée à votre road trip !";
}
?>
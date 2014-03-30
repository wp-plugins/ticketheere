<?
$url = 'https://shop.ticketheere.nl/'.$_GET['url'];

if($_GET['type']!='post') {
    print file_get_contents($url);
} else {
    
    foreach($_POST as $key=>$value) { 
        if(is_array($value)) {
            foreach($value as $k2=>$v2) { 
                $fields_string .= $key.'['.$k2.']='.$v2.'&'; 
            }
        } else {
            $fields_string .= $key.'='.$value.'&'; 
        }
    }
    rtrim($fields_string, '&');
    
    $ch = curl_init();
    
    curl_setopt($ch,CURLOPT_URL, $url);
    curl_setopt($ch,CURLOPT_POST, count($_POST));
    curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
    
    $result = curl_exec($ch);
    
    curl_close($ch);
}
?>
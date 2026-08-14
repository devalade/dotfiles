# Code Smell 154 - Too Many Variables

You debug code and see too many variables declared and active

**TL;DR:** Variables should be as local as possible

## Problems

- Readability

- Code Reuse

## Solutions

- Extract Method

- Remove unused variables

## Sample Code

##### Wrong

```
<?

function retrieveImagesFrom(array $imageUrls) {
  foreach ($imageUrls as $index => $imageFilename) {
    $imageName = $imageNames[$index];
    $fullImageName = $this->directory() . "\\" . $imageFilename;
    if (!file_exists($fullImageName)) {
      if (str_starts_with($imageFilename, 'https://cdn.example.com/')) {
          // TODO: Remove Hardcode
          $url = $imageFilename;
          // This variable duplication is not really necessary
          // When we scope variables
          $saveto= "c:\\temp"."\\".basename($imageFilename);
          // TODO: Remove Hardcode
          $ch = curl_init ($url);
          curl_setopt($ch, CURLOPT_HEADER, 0);
          curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
          $raw = curl_exec($ch);
          curl_close ($ch);
          if(file_exists($saveto)){
               unlink($saveto);
          }
          $fp = fopen($saveto,'x');
          fwrite($fp, $raw);
          fclose($fp);
          $sha1 = sha1_file($saveto);
          $found = false;
          $files = array_diff(scandir($this->directory()), array('.', '..'));
          foreach ($files as $file){
              if ($sha1 == sha1_file($this->directory()."\\".$file)) {
                  $images[$imageName]['remote'] = $imageFilename;
                  $images[$imageName]['local'] = $file;
                  $imageFilename = $file;
                  $found = true;
                  // Iteration keeps going on even after we found it
              }
          }
          if (!$found){
            throw new \Exception('We couldnt find image');
         }
        // Debugging at this point our context is polluted with variables
        // from previous executions no longer needed
        // for example the curl handler
  }

```

##### Right

```
<?php

function retrieveImagesFrom(string imageUrls) {
  foreach ($imageUrls as $index => $imageFilename) {
    $imageName = $imageNames[$index];
    $fullImageName = $this->directory() . "\\" . $imageFilename;
    if (!file_exists($fullImageName)) {
        if ($this->isRemoteFileName($imageFilename)) {
            $temporaryFilename = $this->temporaryLocalPlaceFor($imageFilename);
            $this->retrieveFileAndSaveIt($imageFilename, $temporaryFilename);
            $localFileSha1 = sha1_file($temporaryFilename);
            list($found, $images, $imageFilename) = $this->tryToFindFile($localFileSha1, $imageFilename, $images, $imageName);
            if (!$found) {
                throw new \Exception('File not found locally ('.$imageFilename.'). Need to retrieve it and store it');
            }
        } else {
            throw new \Exception('Image does not exist on directory ' . $fullImageName);
        }
    }

```

## Detection

[X] Automatic

Most Linters can suggest use for long methods.

This warning also hints us to break and scope our variables.

## Tags

- Bloaters

## Conclusion

Extract Method is our best friend.

We should use it a lot.

## Relations

[https://maximilianocontieri.com/code-smell-03-functions-are-too-long](https://maximilianocontieri.com/code-smell-03-functions-are-too-long)
[https://maximilianocontieri.com/code-smell-107-variables-reuse](https://maximilianocontieri.com/code-smell-107-variables-reuse)
[https://maximilianocontieri.com/code-smell-62-flag-variables](https://maximilianocontieri.com/code-smell-62-flag-variables)
# Things idk


### 1
Which is the better way to handle the array?  
Prob:
- have an array that holds the countries that match the query
- need to update it every time the input changes

Solution 1:
- clear the array every time
- run through options and find a match
- add match to array
- but then you have to compare a bajillion countries all over again every single time a letter is typed/deleted

Solution 2:
- every time a new character is added/deleted:
- run through options and find match
- if match is unique to array add it
- but you also have to retest the array for values that don't match and remove them
- ends up as more work but seems like there are scenarios where this would be used?

### 2
child node and nodes...   
can't remember what i needed this for, but it's in so much documentation
maybe something like, if ul already has child nodes, insertBefore  
idk, that's a dumb example, but childnodes vs.innerhtml in general

### 3
asynchronous stuff - all the things  
could this scenario happen ever?
- have global variable
- define value in first function
- need value for second function but still undefined
- is this ever an async issue or always other stuff like passing in parameters?

### 4
closures and callbacks  
:(

### 5
was using toFixed() but that returns a string and wanted to display/calculate at same time  
used (x * 100)/100 instead, but idk?

### 6
what is a use case for input hidden objects?  
I ended up using 2 arrays for autocomplete, one with original word, one with b tags  
kind of wanted a way to have 2 values of an input field so i could call input.value and input.value2 in different cases  
not the same thing, but i found it on Googz

### 7
how should i actually do #6?

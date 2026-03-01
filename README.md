# Tech Stack:
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

# Program Type:
Typing game for private use.

# Setup:
- If using Visual Studio Code, install the "Live Server" extension or it will not properly import modules (word-bank.js)
- Right-click the "index.html" file and hit "Open with Live Server" button (should be on top of list).


# --- [ General Information ] --- #
For the sake of documentation, the phrase "attempt" will mean the following:
- A word, phrase, or sentence being present on the screen and the user having to complete it.

# Settings:
- Varity of customizable options are present. Look through the list below.
    * Highlight Word:         <bool> | Shows the current character being underlined and colored in blue.
    * Disable Score:          <bool> | Disables score component from being present on the bottom of input (hidden, still tracks).
    * Restart Score:          <bool> | Restart button resetting the score.
    * Skip Repeats:           <bool> | Stops from potentially getting the same prompt (generates another one instead).
    * Store Skip Repeats:      <int> | Keeps a list of up to <int> of repeated words. If the current word matches any in that list, generate a new word.
    * Skip With Errors:        <int> | When the user is at the end of the attempt but has at least one error, skip and generate new word.
    NEED TO COMPLETE vvv -----------------------
    * Word Limit:         <dropdown> | Set the word limit of the phrase you get. Phrase must be enabled.
    * Words Checkbox:     <checkbox> | Allows words being available in the pool.
    * Phrases Checkbox:   <checkbox> | Allows phrases being available in the pool.
    * Sentences Checkbox: <checkbox> | Allows sentences being available in the pool.
    * Error Restart:          <bool> | Any errors in the attempt instantly restarts the attempt.
    * Skip Spaces:            <bool> | Auto-fills space characters as to not make the user have to enter space.

# Soon to add:
- Figure out how to display an image in another container below so we can get someone to make art and showcase how the button should be pressed, similar to typing.com's UI (maybe I can hire an artist I know).
- Autoscrolling for the displayed text (if we have a long sentence it is scroll-able but it doesn't focus on it and scroll for you, you manually need to right now).
- More options for customization such as Word Limit, Words Checkbox, Phrases Checkbox, Sentences Checkbox, Error Restart, & Skip Spaces.
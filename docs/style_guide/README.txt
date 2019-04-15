StandardJS will be the style guide used.

Firstly, install the Babel ES6/ES7 extension from the VS Code extensions marketplace. This improves syntax highlighting.

To install the standardjs extension, run the following command:

    npm install standard --global

Next, install the StandardJS extension on the VS Code marketplace. This will show formatting anomalies in the Problems tab.

Go to File|Preferences|Settings
and type “standard” in the search box. Look for the setting "Auto Fix On Save" and check
the tick box. This will autoformat all files upon saving.

The StandardJS module will be added to the 'test' scripts, which will trigger format and error checking.

To install packages and all dependencies before making commits, run the following command:

    npm install

This will install all dependencies in package.json, and will ensure the team has the same environment set up.

__________________________________

StandardJS — The Rules

    2 spaces – for indentation

    Single quotes for strings – except to avoid escaping

    No unused variables

    No semicolons

    Space after keywords if (condition) { ... }

    Space after function name function name (arg) { ... }

    Always use === instead of == – but obj == null is allowed to check null || undefined.

    Always handle the node.js err function parameter

    Declare browser globals with /* global */ comment at top of file
        Prevents accidental use of vaguely-named browser globals like open, length, event, and name.
        Example: /* global alert, prompt */
        Exceptions are: window, document, and navigator

__________________________________

See sample file attached, sample.js

This sample file is taken from the expressjs repo at https://github.com/expressjs/body-parser/blob/master/index.js and is used as an example in StandardJS at https://standardjs.com/

#LightNav

##A lightweight (and beautiful) pop-over navigation

###Super simple with elegant functionality.

- Built in open and close buttons
- Wrapped in a jQuery plugin for easy installation
- Built using lightweight CSS animations
- Supports infinite children
- Installation

The easiest installation you'll ever do. Set up your navigation the way you normally would, and wrap it in an easily identifiable class or id.

```html
<div id="myNav">
    <ul>
        <li><a href="#">Top</a></li>
        <li><a href="#download">Download</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#installation">Installation</a>
            <ul>
                <li><a href="#project-files">Add project files</a></li>
                <li><a href="#javascript">JavaScript</a></li>
            </ul>
        </li>
    </ul>
</div>
```

###Add project files

Just copy `lightnav.css` and `jquery.lightnav.js` into your project. Make sure you also include jQuery.

```html
<link rel="stylesheet" href="css/lightnav.css" type="text/css" media="all" />
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/jquery.lightnav.js"></script>
```

###JavaScript

Then call `.lightnav()` on the navigation container.

Thats it! Minor css tweaks may need to be made. `.lightnav` may need a modified margin and float in order to make the hamburger button cooperate with your design. Colors can easily be changed with css to fit your color scheme.

```javascript
jQuery(document).ready(function($) {
    $('#myNav').lightnav();
});
```

###Upcoming Features

This is version 1.0 of LightNav. I have a couple features in mind but wanted to make the main functionality available as soon as possible. Check back soon for updates and additional features.

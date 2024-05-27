// ==UserScript==
// @name         UCertify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  UCertify autofill
// @author       You
// @match        *.ucertify.com/app/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.onload(() => {
        const markRead = document.getElementsByClassName("text-dark set-unset-time dropdown-item mark_read");

        for (let i=0; i<markRead.length; i++) {
            setTimeout(() => {
                markRead[i].click();
            }, 1000 * i);
        }
    });
})();

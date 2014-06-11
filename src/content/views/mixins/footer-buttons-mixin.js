'use strict';

function hasFooterButtons(contentView, opts) {
    /**
     * Add a button to this ContentView.
     * This will re-render the buttons
     * @param button {Button} Button to add
     * @param [opts] {object}
     * @param [opts.side='left'] {'right'|'left'} Which side of the footer to add
     *     the button to
     */
    contentView.addButton = function (button, opts) {
        contentView._footerView.addButton(button, opts);
    };

    /**
     * Remove a Button from the ContentView
     * @param button {Button} Button to remove
     */
    contentView.removeButton = function (button) {
        contentView._footerView.removeButton(button);
    };
};

module.exports = hasFooterButtons;

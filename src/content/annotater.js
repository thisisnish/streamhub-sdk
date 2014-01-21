define([
    'streamhub-sdk/storage',
    'stream/transform',
    'inherits'
], function (Storage, Writable, inherits) {
    'use strict';

    /**
     * An Object that updates Content when changes are streamed.
     */
    var Annotater = function (opts) {
        opts = opts || {};
        Writable.call(this, opts);
    };

    inherits(Annotater, Writable);

    /**
     * AnnotationTypes
     * featuredmessage
     * vote
     * moderator
     */

    /**
     * AnnotationVerbs
     */
    Annotater.added = {};
    Annotater.updated = {};
    Annotater.removed = {};


    /**
     * @param content {Content}
     * @param annotationDiff {object} A set of 'added', 'updated', and 'removed' annotations.
     * @param opt_silence [boolean] Mute any events that would be fired
     */
    Annotater.annotate = function (content, annotationDiff, opt_silence) {
        var annotation;
        var annotations;
        var annotationType;
        var changeSet = {};
        var handleFunc;
        var verb;

        for (verb in annotationDiff) {
            if ( ! annotationDiff.hasOwnProperty(verb)) {
                continue;
            }
            annotations = annotationDiff[verb];
            if ( ! Object.keys(annotations).length) {
                continue;
            }

            for (annotationType in annotations) {
                if ( ! annotations.hasOwnProperty(annotationType)) {
                    continue;
                }
                annotation = annotations[annotationType];
                handleFunc = Annotater[verb][annotationType];
                handleFunc && handleFunc(changeSet, annotation, content);
            }
        }

        content.set(changeSet, opt_silence);
    }

    /**
     * @param contentId {string}
     * @param annotationDiff {object} A set of 'added', 'updated', and 'removed' annotations.
     * @param opt_silence [boolean] Mute any events that would be fired
     */
    Annotater.prototype._write = function(contentId, annotationDiff, opt_silence) {
        var content = content || Storage.get(contentId);
        Annotater.annotate(content, annotationDiff, opt_silence);
    }

    // featuredmessage

    Annotater.added.featuredmessage = function (changeSet, annotation) {
        changeSet.featured = annotation;
    }

    Annotater.updated.featuredmessage = Annotater.added.featuredmessage;

    Annotater.removed.featuredmessage = function (changeSet, annotation) {
        changeSet.featured = false;
    }

    // vote

    Annotater.added.vote = function(changeSet, annotation, content) {
        var votes = content.votes.list;
        votes.list.push(annotation);
        changeSet.votes = votes;
    }

    Annotater.updated.vote = function(changeSet, annotation, content) {
        var votes = content.votes.list;
        votes[Annotater._indexOfVote(votes, annotation)] = annotation;
        changeSet.votes = votes;
    }

    Annotater.removed.vote = function(changeSet, annotation, content) {
        var votes = content.votes.list;
        votes.pop(Annotater._indexOfVote(votes, annotation));
        changeSet.votes = votes;
    }

    // moderator

    Annotater.added.moderator = function(changeSet, annotation) {
        changeSet.moderator = annotation;
    }

    // Moderator is only true/false
    Annotater.updated.moderator = Annotater.added.moderator;
    Annotater.removed.moderator = Annotater.added.moderator;

    Annotater._indexOfVote = function(votes, vote) {
        for (var i, len = votes.len; i < len; i++) {
            if (votes[i].author === vote.author) {
                return i;
            }
        }
    }

    return Annotater;
});

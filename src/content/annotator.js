define([
    'streamhub-sdk/storage',
    'stream/transform',
    'inherits'
], function (Storage, Writable, inherits) {
    'use strict';

    /**
     * An Object that updates Content when changes are streamed.
     */
    var Annotator = function (opts) {
        opts = opts || {};
        Writable.call(this, opts);
    };

    inherits(Annotator, Writable);

    /**
     * AnnotationTypes
     * featuredmessage
     * vote
     * moderator
     */

    /**
     * AnnotationVerbs
     */
    Annotator.added = {};
    Annotator.updated = {};
    Annotator.removed = {};


    /**
     * @param content {Content}
     * @param annotationDiff {object} A set of 'added', 'updated', and 'removed' annotations.
     * @param opt_silence [boolean] Mute any events that would be fired
     */
    Annotator.annotate = function (content, annotationDiff, opt_silence) {
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
                handleFunc = Annotator[verb][annotationType];
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
    Annotator.prototype._write = function(contentId, annotationDiff, opt_silence) {
        var content = content || Storage.get(contentId);
        Annotator.annotate(content, annotationDiff, opt_silence);
    }

    // featuredmessage

    Annotator.added.featuredmessage = function (changeSet, annotation) {
        changeSet.featured = annotation;
    }

    Annotator.updated.featuredmessage = Annotator.added.featuredmessage;

    Annotator.removed.featuredmessage = function (changeSet, annotation) {
        changeSet.featured = false;
    }

    // vote

    Annotator.added.vote = function(changeSet, annotation, content) {
        var votes = content.votes.list;
        votes.list.push(annotation);
        changeSet.votes = votes;
    }

    Annotator.updated.vote = function(changeSet, annotation, content) {
        var votes = content.votes.list;
        votes[Annotator._indexOfVote(votes, annotation)] = annotation;
        changeSet.votes = votes;
    }

    Annotator.removed.vote = function(changeSet, annotation, content) {
        var votes = content.votes.list;
        votes.pop(Annotator._indexOfVote(votes, annotation));
        changeSet.votes = votes;
    }

    // moderator

    Annotator.added.moderator = function(changeSet, annotation) {
        changeSet.moderator = annotation;
    }

    // Moderator is only true/false
    Annotator.updated.moderator = Annotator.added.moderator;
    Annotator.removed.moderator = Annotator.added.moderator;

    Annotator._indexOfVote = function(votes, vote) {
        for (var i, len = votes.len; i < len; i++) {
            if (votes[i].author === vote.author) {
                return i;
            }
        }
    }

    return Annotator;
});

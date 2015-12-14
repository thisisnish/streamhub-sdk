require([
    'livefyre-auth',
    'auth/contrib/auth-button',
    'livefyre-auth/livefyre-auth-delegate',
    'streamhub-sdk/debug',
    'streamhub-sdk/jquery',
    'streamhub-sdk/content/views/content-list-view',
    'streamhub-sdk/collection',
    'streamhub-sdk/content',
    'streamhub-sdk/auth',
    'streamhub-sdk/collection/followers'
],function (auth, createAuthButton, livefyreAuthDelegate, debug,
$, ListView, Collection, Content, Auth, Followers) {
    window.auth = auth;
    var log = debug('streamhub-sdk/auth-demo');
    var authButton = createAuthButton(auth, document.getElementById('auth-button'));

    var delegate = window.delegate = livefyreAuthDelegate('http://qa-ext.livefyre.com');
    auth.delegate(delegate);


    var opts = {
        "network": "livefyre.com",
        "siteId": "290596",
        "articleId": "307",
        "environment": "qa-ext.livefyre.com"
    };
    var listView = window.view = new ListView({
        el: document.getElementById("listView"),
    });

    var collection = window.collection = new Collection(opts);
    
    collection.pipe(listView);

    var followers = window.followers = new Followers(collection);

    var user;
    var livefyreUser = auth.get('livefyre');
    var $tokenInput = $('*[name=lftoken]');
    function setUser (_user) {
        user = _user;
        $tokenInput.val(_user.get('token'));
    }
    if (livefyreUser) {
        setUser(livefyreUser);
    }
    auth.on('login.livefyre', setUser);
    auth.on('logout', function () {
        $tokenInput.val('');
    });

    function xyz (data) {
        console.log('I CAN HAZ DATA:', data);
        if (data.id !== user.get('id')) {
            return;
        }
        console.log('STREAM: User', data.id, 'is', (data.following ? 'following' : 'not following'));
    }

    followers.on('follower', xyz);
    followers.removeListener('follower', xyz);

    // followers.on('followers', function (data) {
    //     console.log('I CAN HAZ ALL DATA:', data);
    // });

    var $writeForm = $('#write-form');
    $writeForm.submit(function (e) {
        e.preventDefault();

        var formArray = $writeForm.serializeArray(),
            body = formArray[0].value,
            tweetId = formArray[1].value,
            lftoken = formArray[2].value,
            contentToWrite;
        if (body) {
            contentToWrite = new Content(body);
        } else if (tweetId) {
            contentToWrite = { tweetId: tweetId };
        }
        if (lftoken) {
            Auth.setToken(lftoken);
        }
        if ( ! Auth.getToken() || ! contentToWrite) {
            alert("Cant write. Not enough info");
            return;
        }
        collection.write(contentToWrite);

    });
});

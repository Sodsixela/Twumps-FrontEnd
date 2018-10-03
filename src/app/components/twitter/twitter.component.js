"use strict";

let twitter_controller = function twitterController($http, $state, GlobalConfigFactory) {
    let self = this;
    self.url = GlobalConfigFactory.url_back;
    $http.get(self.url + 'twitter/config')
        .then((response) => {
            self.tweet = response.data;
        });

    self.submit = () => {
        self.temp = {"id": self.tweet.ID, "account": self.tweet.ACCOUNT, "hashtag":self.tweet.HASHTAG, "used": self.tweet.USED, "ads": self.tweet.ADS};
        $http({
            method  : 'POST',
            url     : self.url + 'twitter',
            data    : self.temp,
            headers : { 'Content-Type': 'application/json' }
        }).then((response) => {
            if (response.status === 200)
                $state.reload();
        });
    };

    self.changeStatus = (item) => {
        item.USED === 0 ? item.USED = 1 : item.USED = 0;
    };

    self.changeStatusAds = (item) => {
        item.ADS === 0 ? item.ADS = 1 : item.ADS = 0;
    };
};

twitter_controller.$inject = ['$http', '$state', 'GlobalConfigFactory'];

let twitter = {
    templateUrl: 'app/components/twitter/twitter.html',
    controllerAs: "twc",
    controller: twitter_controller
};

module.exports = twitter;
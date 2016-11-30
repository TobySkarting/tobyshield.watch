/* Copyright 2015, All Rights Reserved. */
var checkTimeout = 5000
  , checkDelay = 100
  , showIPPort = true
  , showConnection = true
  , clickToRefresh = false
  , fixPing = true
  , selected = "Main"
  , subSelection = ""
  , processing = 0
  , hash = window.location.hash.split('-')
  , alreadyProcessed = []
  , rendered = 0
  , loadingTimers = []
  , loadingArr = [{
    loading: true,
    unknown: true
}]
  , clockTicking = false;
if (hash.length) {
    switch (hash[0]) {
    case "#GMS62":
    case "#TWMS113":
    case "#TWMS117":
        selected = hash[0].replace('#', '');
        break;
    default:
        break;
    }
}
if (hash.length > 1) {
    subSelection = hash[1];
} else {
    subSelection = GetDefaultSubSelectionForVersion(selected);
}
function ping(ip, callback) {
    if (!this.inUse) {
        this.status = 'unchecked';
        this.inUse = true;
        this.callback = callback;
        this.ip = ip;
        this.start = 0;
        var _that = this;
        this.img = new Image();
        this.img.onload = function(e) {
            window.clearInterval(_that.timer);
            _that.inUse = false;
            _that.callback('responded', +(new Date()) - _that.start);
            if (--processing == 0)
                if (window.stop) {
                    window.stop();
                } else if (document.execCommand) {
                    document.execCommand('Stop');
                }
            ;
        }
        ;
        this.img.onerror = function(e, error, errorThrown) {
            if (_that.inUse) {
                window.clearInterval(_that.timer);
                _that.inUse = false;
                _that.callback('responded', +(new Date()) - _that.start, e);
                if (--processing == 0)
                    if (window.stop) {
                        window.stop();
                    } else if (document.execCommand) {
                        document.execCommand('Stop');
                    }
                ;return true;
            }
        }
        ;
        this.start = +(new Date());
        this.img.src = "http://" + ip + "/?cachebreaker=" + (+(new Date()));
        this.timer = setTimeout(function() {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('timeout', false);
                if (--processing == 0)
                    if (window.stop) {
                        window.stop();
                    } else if (document.execCommand) {
                        document.execCommand('Stop');
                    }
                ;
            }
        }, GetCheckTimeout());
    }
}
var PingModel = function(servers) {
    var addr = servers[0].address;
    // Hacky, for some reason the foreach binding fires twice.
    if (!(servers[0].name == 'Self') && alreadyProcessed.indexOf(addr) == -1) {
        alreadyProcessed.push(servers[0].address);
        return;
    }
    var serversArr = [];
    var x = servers;
    for (var i = 0; i < servers.length; i++)
        for (var j = 0; j < servers[i].length; j++)
            serversArr.push(servers[i][j]);
    var self = this;
    var myServers = [];
    var offset = 1;
    ko.utils.arrayForEach(serversArr, function(server) {
        if (!server.isMapleStoryGameServer || server.rel == subSelection || (server.rel == "Login" && (selected != 'GMS' && selected != 'TWMS113'))) {
            myServers.push({
                icon: server.icon,
                name: server.name,
                sub: server.sub || false,
                interval: server.interval || false,
                address: server.address,
                port: server.port,
                unknown: server.unknown || false,
                status: ko.observable('unchecked'),
                time: ko.observable(""),
                values: ko.observableArray(),
                rel: server.rel
            });
        }
    });
    self.servers = ko.observableArray(myServers);
    processing += self.servers().length;
    ko.utils.arrayForEach(self.servers(), function(s) {
        s.status('checking');
        function doPing() {
            new ping(s.address + ":" + s.port,function(status, time, e) {
                s.status(status);
                s.time(time);
                s.values.push(time);
                if (s.name == "Self") {
                    SetPingOffset(time);
                }
                console.clear();
                /*if (s.interval) {
					setTimeout(doPing, s.interval);
				}*/
            }
            );
        }
        setTimeout(function() {
            doPing();
        }, checkDelay * offset++)
    });
};
var GameServer = function(version, timeOffset, icons, servers) {
    return {
        name: "伺服器",
        description: "版本：" + version,
        selectedServers: ko.observable(loadingArr),
        icons: icons,
        timeOffset: timeOffset,
        content: function() {
            return new PingModel(servers)
        }
    }
}
var servers = {
    TWMS113: {
        Login: [{
            icon: "Gemini.png",
            name: "童年谷",
            address: "220.135.55.5",
            port: "8484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "登入伺服器"
        }, {
            icon: "Aquila.png",
            name: "恰恰谷",
            address: "61.218.24.203",
            port: "8484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "登入伺服器"
        }, {
            icon: "Bootes.png",
            name: "懷舊谷",
            address: "59.121.104.118",
            port: "8484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "登入伺服器"
        }, {
            icon: "Cassiopeia.png",
            name: "奇奇谷",
            address: "106.1.254.72",
            port: "8484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "登入伺服器"
        }, {
            icon: "Hercules.png",
            name: "瘋子谷",
            address: "220.132.134.97",
            port: "8484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "登入伺服器"
        }, {
            icon: "Izar.png",
            name: "棉花谷",
            address: "61.218.238.74",
            port: "8484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "登入伺服器"
        }, {
            icon: "Elysium.png",
            name: "AsuraMS",
            address: "220.131.144.153",
            port: "8484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "登入伺服器"
        }, {
            icon: "Bera.png",
            name: "辛巴谷",
            address: "119.10.159.170",
            port: "8484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "登入伺服器"
        }, {
            icon: "Delphinus.png",
            name: "西西谷",
            address: "119.10.159.186",
            port: "8484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "登入伺服器"
        }, {
            icon: "Croa.png",
            name: "喵喵谷",
            address: "103.11.38.126",
            port: "18484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "登入伺服器"
        }],
        Tongnian: [{
            icon: "Gemini.png",
            name: "Channel 1",
            address: "220.135.55.5",
            port: "8586",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "童年谷"
        }],
        Aquila: [{
            icon: "Aquila.png",
            name: "Channel 1",
            address: "203.69.252.203",
            port: "8586",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "恰恰谷"
        }, {
            icon: "Aquila.png",
            name: "Channel 11",
            address: "203.69.252.203",
            port: "7585",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "恰恰谷"
        }],
        Bootes: [{
            icon: "Bootes.png",
            name: "Channel 1",
            address: "59.121.104.118",
            port: "8586",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "懷舊谷"
        }],
        Cassiopeia: [{
            icon: "Cassiopeia.png",
            name: "Channel 1",
            address: "106.1.254.72",
            port: "8586",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "奇奇谷"
        }],
        Hercules: [{
            icon: "Hercules.png",
            name: "Channel 1",
            address: "220.132.134.97",
            port: "8586",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "瘋子谷"
        }],
        Mianhua: [{
            icon: "Izar.png",
            name: "Channel 1",
            address: "61.218.238.74",
            port: "7575",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "棉花谷"
        }],
        AsuraMS: [],
        Xinba: [{
            icon: "Bera.png",
            name: "Channel 1",
            address: "119.10.159.170",
            port: "8586",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "辛巴谷"
        }],
        XiXi: [{
            icon: "Delphinus.png",
            name: "Channel 1",
            address: "119.10.159.186",
            port: "8586",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "西西谷"
        }],
        Miaomiao: [{
            icon: "Croa.png",
            name: "Channel 1",
            address: "103.11.38.126",
            port: "18586",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "喵喵谷"
        }],
    },
    TWMS117: {

    }
};
var checker = {
    isMainPage: ko.observable(selected == "Main"),
    selected: ko.observable(selected),
    subSelection: ko.observable(subSelection),
    getDefaultSubSelectionForVersion: GetDefaultSubSelectionForVersion,
    modifySettings: ModifySettings,
    defaultSettings: DefaultSettings,
    getServersCountForApplication: GetServersCountForApplication,
    versions: [{
        abbr: "TWMS113",
        name: "MapleStory 113",
        available: true,
        complete: false,
        icon: "StarPlanet.png",
        short: "TWMS113",
        serverCount: [11],
        applications: [GameServer("113", 8, [{
            icon: "Mushroom.png",
            name: "登入伺服器",
            english: false,
            sub: ""
        }, {
            icon: "Gemini.png",
            name: "童年谷",
            english: false,
            sub: "World"
        }, {
            icon: "Aquila.png",
            name: "恰恰谷",
            english: false,
            sub: "World"
        }, {
            icon: "Bootes.png",
            name: "懷舊谷",
            english: false,
            sub: "World"
        }, {
            icon: "Cassiopeia.png",
            name: "奇奇谷",
            english: false,
            sub: "World"
        }, {
            icon: "Hercules.png",
            name: "瘋子谷",
            english: false,
            sub: "World"
        }, {
            icon: "Izar.png",
            name: "棉花谷",
            english: false,
            sub: "World"
        }, {
            icon: "Elysium.png",
            name: "AsuraMS",
            english: false,
            sub: "World"
        }, {
            icon: "Bera.png",
            name: "辛巴谷",
            english: false,
            sub: "World"
        }, {
            icon: "Delphinus.png",
            name: "西西谷",
            english: false,
            sub: "World"
        }, {
            icon: "Croa.png",
            name: "喵喵谷",
            english: false,
            sub: "World"
        }, ], [servers.TWMS113.Login, servers.TWMS113.Tongnian, servers.TWMS113.Aquila, servers.TWMS113.Bootes, servers.TWMS113.Cassiopeia, servers.TWMS113.Hercules, servers.TWMS113.Mianhua, servers.TWMS113.AsuraMS, servers.TWMS113.Xinba, servers.TWMS113.XiXi, servers.TWMS113.Miaomiao, ])]
    }, {
        abbr: "TWMS117",
        name: "MapleStory 117",
        available: false,
        complete: false,
        icon: "Kradia.png",
        short: "TWMS117",
        serverCount: [0],
        applications: [],
    }, ],
    updateSelectedServers: UpdateSelectedServers,
    selectedIcon: ko.observable(GetEnglishIconNameForServer(this.subSelection)),
    settings: {
        pingOffset: ko.observable(0),
        delay: ko.observable(readCookie("Delay") ? readCookie("Delay") : 100),
        clickToRefresh: ko.observable(readCookie("ClickToRefresh") == "false" ? false : false),
        fixPing: ko.observable(readCookie("FixPing") == "false" ? false : true),
        showConnection: ko.observable(readCookie("ShowConnection") == "false" ? false : true),
        showIPPort: ko.observable(readCookie("ShowIPPort") == "false" ? false : true),
        timeout: ko.observable(readCookie("Timeout") ? readCookie("Timeout") : 5000),
        showControls: ko.observable(false)
    },
    currentTime: ko.observable('<span><i class="fa fa-cog fa-spin"></i> Checking server time...</span>')
};
checker.subSelection.subscribe(function(newValue) {
    checker.selectedIcon(GetEnglishIconNameForServer(newValue));
});
if (selected != 'Main') {
    GetPingOffset();
}
ko.applyBindings(checker);
function GetEnglishIconNameForServer(serverName) {
    switch (serverName) {
    case "스카니아":
        return "Scania";
    case "베라":
        return "Bera";
    case "루나":
        return "Luna";
    case "제니스":
        return "Zenith";
    case "크로아":
        return "Croa";
    case "유니온":
        return "Union";
    case "엘리시움":
        return "Elysium";
    case "이노시스":
        return "Enosis";
    case "레드":
        return "Red";
    case "오로라":
        return "Aurora";
    case "Login":
        return "Mushroom";
    default:
        return serverName;
    }
}
function UpdateSelectedServers(parent, index, name) {
    var name = name || checker.subSelection();
    if (loadingTimers.length > index) {
        window.clearInterval(loadingTimers[index]);
    }
    if (parent.name == "伺服器" && !clockTicking) {
        clockTicking = true;
        setInterval(function() {
            var d = new Date()
              , o = d.getTimezoneOffset() / 60;
            d.setHours(d.getHours() + o + parent.timeOffset);
            checker.currentTime('<span><i class="fa fa-clock-o"></i> 伺服器時間</span> ' + moment(d).format('h:mm:ss') + ' <span>' + moment(d).format('A') + '</span>');
        }, 1000);
    }
    parent.selectedServers(loadingArr);
    window.location.hash = '#' + checker.selected() + '-' + name;
    subSelection = name;
    checker.subSelection(name);
    loadingTimers.push(setTimeout(function() {
        var content = parent.content();
        parent.selectedServers(parent.content().servers());
    }, 300));
}
function GetCheckTimeout() {
    return checker.settings.timeout();
}
function GetPingOffset() {
    return new PingModel([{
        icon: "Mushroom.png",
        name: "Self",
        address: "127.0.0.1",
        port: "80",
        interval: 5000,
        values: [],
        unknown: true,
        rel: "Self"
    }]);
}
function GetDefaultSubSelectionForVersion(version) {
    switch (version) {
    case 'EMS':
        return 'Kradia';
    case 'GMS':
        return 'Login';
    case 'KMS':
        return '스카니아';
    case 'TWMS113':
        return '登入伺服器';
    default:
        return;
    }
}
function SetPingOffset(offset) {
    checker.settings.pingOffset(offset);
}
function ModifySettings() {
    var delay = checker.settings.delay()
      , timeout = checker.settings.timeout();
    createCookie("Delay", delay > 10000 ? 10000 : (delay < 50 ? 50 : delay), 3650);
    createCookie("Timeout", timeout > 60000 ? 60000 : (timeout < 500 ? 500 : timeout), 3650);
    createCookie("ShowIPPort", checker.settings.showIPPort(), 3650);
    createCookie("ShowConnection", checker.settings.showConnection(), 3650);
    createCookie("ClickToRefresh", checker.settings.clickToRefresh(), 3650);
    createCookie("FixPing", checker.settings.fixPing(), 3650);
    window.location.reload();
}
function DefaultSettings() {
    checker.settings.delay(checkDelay);
    checker.settings.timeout(checkTimeout);
    checker.settings.showIPPort(showIPPort);
    checker.settings.showConnection(showConnection);
    checker.settings.clickToRefresh(clickToRefresh);
    checker.settings.fixPing(fixPing);
}
function GetServersCountForApplication(version, name) {
    var v = false;
    for (var i = 0; i < checker.versions.length; i++) {
        if (checker.versions[i].name == version) {
            v = checker.versions[i];
            break;
        }
    }
    if (v == false) {
        return 0;
    }
    for (var j = 0; j < v.applications.length; j++) {
        if (v.applications[j].name == name) {
            return v.serverCount[j];
        }
    }
    return 0;
}
function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else
        var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null ;
}

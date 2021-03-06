const Lang = imports.lang;
const Gst = imports.gi.Gst;

const URI = 'https://translate.google.com/translate_tts?client=tw-ob&ie=UTF-8&total=1&idx=0&textlen=%d&q=%s&tl=%s';
const MAX_LEN = 100;

const GoogleTTS = new Lang.Class({
    Name: 'GoogleTTS',

    _init: function() {
        Gst.init(null, 0);

        this._player = Gst.ElementFactory.make("playbin", "player");
        this._bus = this._player.get_bus();
        this._bus.add_signal_watch();

        this._bus.connect("message::error", Lang.bind(this, this._kill_stream));
        this._bus.connect("message::eos", Lang.bind(this, this._kill_stream));
    },

    _kill_stream: function() {
        this._player.set_state(Gst.State.NULL);
    },

    speak: function(text, lang) {
        let extract = text.substr(0, MAX_LEN - 1);
        this._kill_stream();

        let uri = URI.format(extract.length, encodeURIComponent(extract), lang);
        this._player.set_property("uri", uri);
        this._player.set_state(Gst.State.PLAYING);
    },

    destroy: function() {
        this._player.set_state(Gst.State.NULL);
    },
});

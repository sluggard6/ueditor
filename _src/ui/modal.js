/*modal  类*/
UE.ui.define('modal', {
    tpl: '<div id="help" class="modal hide" tabindex="-1" >' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-hide="modal">×</button>' +
        '<h3><%=title%></h3>' +
        '</div>' +
        '<div class="modal-body">' +
        '<iframe height="100%" width="100%" frameborder="0" src="<%=url%>"></iframe>' +
        ' </div>' +
        '<% if(!nook) {%>'+
        '<div class="modal-footer">' +
        '<button class="btn" data-hide="modal">关闭</button>' +
        '<button class="btn btn-primary" data-ok="modal">确认</button>' +
        '</div>' +
        '<%}%>'+
        '</div>',
    default: {
        title:"",
        url:"",
        nook:false,
        backdrop: true,
        keyboard: true,
        show: false
    },
    init: function (options) {
        var me = this;

        me.root($($.parseTmpl(me.tpl,options)));
        me.options = options
        me.root().delegate('[data-hide="modal"]', 'click', $.proxy(me.hide, me))
        me.root().delegate('[data-ok="modal"]', 'click', $.proxy(me.ok, me))

    },
    toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
    },
    show: function () {
        var me = this

        me.trigger("show")

        if (me.isShown) return

        me.isShown = true

        me.escape()

        me.backdrop(function () {
            me.root().show()

            me.root().addClass('in')

            me.root().focus().trigger('shown')

        })
    },
    hide: function (e) {
        var me = this

        me.trigger("hide")

        if (!me.isShown) return

        me.isShown = false

        me.escape()

        me.root().removeClass('in')

        me.hideModal()
    },
    escape: function () {
        var me = this;
        if (me.isShown && me.options.keyboard) {
            me.root().on('keyup', function (e) {
                e.which == 27 && me.hide()
            })
        } else if (!me.isShown) {
            me.root().off('keyup')
        }
    },
    hideModal: function () {
        var me = this
        me.root().hide()
        me.backdrop(function () {
            me.removeBackdrop()
            me.trigger('hidden')
        })
    },
    removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    },
    backdrop: function (callback) {
        var me=this;
        if (me.isShown && me.options.backdrop) {
            me.$backdrop = $('<div class="modal-backdrop" />')
                .appendTo(document.body)

            me.$backdrop.click(
                me.options.backdrop == 'static' ?
                    $.proxy(me.root()[0].focus, me.root()[0])
                    : $.proxy(me.hide, me)
            )

            me.$backdrop.addClass('in')

        } else if (!me.isShown && me.$backdrop) {
            me.$backdrop.removeClass('in')
        }

        callback && callback()

    },
    ok: function () {
        var me = this
        me.trigger("ok")
        me.hide()
    }
});

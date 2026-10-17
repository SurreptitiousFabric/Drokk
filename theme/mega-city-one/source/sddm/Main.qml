import QtQuick
import SddmComponents 2.0

Rectangle {
    id: root
    width: 1672; height: 941; color: @@color:background@@
    property int preferredSession: {
        for (var i = 0; i < sessionModel.rowCount(); i++) {
            var name = String(sessionModel.data(sessionModel.index(i, 0), Qt.DisplayRole) || "")
            if (name.indexOf("uwsm") !== -1) return i
        }
        return sessionModel.lastIndex
    }
    Item {
        width: 1672; height: 941; anchors.centerIn: parent
        scale: Math.max(root.width / width, root.height / height)
        Image { anchors.fill: parent; source: "background.png"; smooth: false }
        // Opaque live form completely covers the concept's painted controls.
        // The original gold plaque border and every exterior artwork pixel stay intact.
        LoginForm {
            id: form; x: 641; y: 273
            initialUser: userModel.lastUser
            sessions: sessionModel; initialSession: root.preferredSession
            onLoginRequested: function(user, password, session) { sddm.login(user, password, session) }
        }
    }
    Connections {
        target: sddm
        function onLoginFailed() { form.rejectLogin() }
        function onLoginSucceeded() { form.busy = true }
    }
}

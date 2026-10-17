import QtQuick
import QtQuick.Controls

Rectangle {
    id: form
    width: 390; height: 369
    color: @@color:background@@
    property string initialUser: ""
    property var sessions: null
    property int initialSession: 0
    property bool busy: false
    property string failureMessage: ""
    signal loginRequested(string user, string password, int session)
    FontLoader { id: bodyFont; source: "fonts/PlexSans-Variable.ttf" }
    FontLoader { id: headingFont; source: "fonts/ShureTechMonoNerdFontMono-Regular.ttf" }
    function submit() {
        if (busy || username.text.trim().length === 0 || session.currentIndex < 0) return
        busy = true; failureMessage = ""
        var submitted = password.text
        password.clear()
        loginRequested(username.text.trim(), submitted, session.currentIndex)
    }
    function rejectLogin() {
        busy = false; failureMessage = "Sign-in failed. Please try again."
        password.clear(); password.forceActiveFocus()
    }
    function focusPassword() { password.forceActiveFocus() }
    Component.onCompleted: password.forceActiveFocus()

    Text {
        anchors.horizontalCenter: parent.horizontalCenter; y: 20
        text: "JUDGE IDENTIFICATION"; color: @@color:foreground@@
        font.family: headingFont.name; font.pixelSize: 23; font.letterSpacing: 2
    }
    Text {
        anchors.horizontalCenter: parent.horizontalCenter; y: 53
        text: "JUSTICE DEPARTMENT"; color: @@color:accent@@
        font.family: headingFont.name; font.pixelSize: 11; font.letterSpacing: 4
    }
    Rectangle { x: 25; y: 91; width: 140; height: 1; color: @@color:accent@@ }
    Image { x: 185; y: 78; width: 20; height: 28; source: "background.png"; sourceClipRect: Qt.rect(826, 350, 20, 28); smooth: false; fillMode: Image.PreserveAspectFit }
    Rectangle { x: 225; y: 91; width: 140; height: 1; color: @@color:accent@@ }

    TextField {
        id: username; objectName: "username"
        x: 25; y: 125; width: 340; height: 40
        text: form.initialUser; enabled: !form.busy; placeholderText: "User name"
        leftPadding: 15; color: @@color:foreground@@; placeholderTextColor: @@color:foreground@@
        font.family: bodyFont.name; font.pixelSize: 15
        Accessible.name: "User name"
        background: Rectangle { color: @@color:background@@; radius: 4; border.width: 1; border.color: username.activeFocus ? @@color:accent@@ : @@color:blue@@ }
        KeyNavigation.tab: password
        onAccepted: password.forceActiveFocus()
    }
    TextField {
        id: password; objectName: "password"
        x: 25; y: 177; width: 340; height: 42
        enabled: !form.busy; echoMode: TextInput.Password; passwordMaskDelay: 0
        placeholderText: "Password"; leftPadding: 15
        color: @@color:foreground@@; placeholderTextColor: @@color:foreground@@
        font.family: bodyFont.name; font.pixelSize: 16
        Accessible.name: "Password"
        background: Rectangle { color: @@color:background@@; radius: 4; border.width: password.activeFocus ? 2 : 1; border.color: form.failureMessage ? @@color:red@@ : password.activeFocus ? @@color:accent@@ : @@color:blue@@ }
        onAccepted: form.submit()
        Keys.onEscapePressed: clear()
        KeyNavigation.tab: signIn
    }
    Button {
        id: signIn; objectName: "signIn"
        x: 25; y: 239; width: 340; height: 43
        enabled: !form.busy && username.text.trim().length > 0 && session.currentIndex >= 0
        text: form.busy ? "Signing in…" : "Sign in"
        contentItem: Text { text: signIn.text; color: @@color:background@@; font.family: bodyFont.name; font.pixelSize: 17; horizontalAlignment: Text.AlignHCenter; verticalAlignment: Text.AlignVCenter }
        background: Rectangle { color: signIn.down ? Qt.darker(@@color:accent@@, 1.15) : signIn.hovered ? Qt.lighter(@@color:accent@@, 1.08) : @@color:accent@@; radius: 4; opacity: signIn.enabled ? 1 : 0.65; border.width: signIn.activeFocus ? 2 : 0; border.color: @@color:foreground@@ }
        onClicked: form.submit()
        KeyNavigation.tab: session
    }
    Text { x: 25; y: 316; text: "Session"; color: @@color:foreground@@; font.family: bodyFont.name; font.pixelSize: 15 }
    ComboBox {
        id: session; objectName: "session"
        x: 132; y: 306; width: 233; height: 35
        model: form.sessions; textRole: "name"; currentIndex: form.initialSession
        enabled: !form.busy
        font.family: bodyFont.name; font.pixelSize: 14
        palette.text: @@color:foreground@@; palette.buttonText: @@color:foreground@@
        palette.button: @@color:background@@; palette.base: @@color:background@@
        palette.highlight: @@color:accent@@; palette.highlightedText: @@color:background@@
        background: Rectangle { color: @@color:background@@; radius: 4; border.width: session.activeFocus ? 2 : 1; border.color: session.activeFocus ? @@color:accent@@ : @@color:blue@@ }
        Accessible.name: "Desktop session"
        KeyNavigation.tab: username
    }
    Text {
        x: 25; y: 285; width: 340; height: 20
        text: form.failureMessage; color: @@color:red@@; font.family: bodyFont.name; font.pixelSize: 12
        elide: Text.ElideRight; Accessible.role: Accessible.AlertMessage
    }
}

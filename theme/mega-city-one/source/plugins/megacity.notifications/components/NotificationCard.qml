import QtQuick
import QtQuick.Layouts
import "../NotificationLogic.js" as NotificationLogic

Item {
    id: root
    property string app: ""
    property string appIcon: ""
    property string category: ""
    property string summary: ""
    property string body: ""
    property string image: ""
    property string glyph: ""
    property int urgency: 1
    property double timestamp: 0
    property int cornerRadius: 10
    property string fontFamily: @@font:icons@@
    property string interfaceFamily: @@font:interface@@
    property var iconResolver: null
    readonly property string iconMarker: appIcon || (image.startsWith("image://icon/") ? image.slice("image://icon/".length) : "")
    readonly property string kind: {
        if (/^megacity-(download|success|warning|info)$/.test(iconMarker)) return iconMarker.slice("megacity-".length)
        if (category === "transfer.complete") return "download"
        if (category === "network.connected") return "success"
        if (category === "device.battery.low" || category === "battery.low" || /battery.*(caution|low|empty)/i.test(iconMarker)) return "error"
        if (/^(transfer|network|device)\.error$/.test(category)) return "error"
        if (category === "device.battery.warning") return "warning"
        return "info"
    }
    readonly property string mediaSource: image.startsWith("image://icon/") ? (iconResolver ? iconResolver(image.slice("image://icon/".length)) : "") : image
    property string actionLabel: ""
    property color accent: @@color:accent@@
    property color errorText: @@color:status.error@@
    readonly property string effectiveKind: urgency === 2 ? "error" : kind
    readonly property bool semanticIcon: effectiveKind !== "info" || /^megacity-(download|success|warning|info)$/.test(iconMarker)
    readonly property color tileColor: effectiveKind === "error" ? @@color:red@@
        : effectiveKind === "success" ? @@color:status.success@@
        : effectiveKind === "warning" ? @@color:status.warning@@
        : effectiveKind === "download" ? accent : @@color:status.info@@
    readonly property string tileSymbol: effectiveKind === "error" && /battery/i.test(category + " " + iconMarker) ? "battery-error" : effectiveKind
    readonly property bool hovered: hover.hovered
    signal closeRequested()
    signal cardClicked()

    implicitWidth: 380
    implicitHeight: Math.max(actionLabel.length > 0 ? 116 : 96, content.implicitHeight + 36)

    Rectangle {
        anchors.fill: parent
        radius: 10
        color: Qt.alpha(@@color:shell.notifications.background@@, @@alpha:shell.notifications.background-alpha@@)
        border.width: 1
        border.color: Qt.alpha(@@color:shell.notifications.border@@, @@alpha:shell.notifications.border-alpha@@)
    }
    HoverHandler { id: hover }
    MouseArea {
        anchors.fill: parent
        acceptedButtons: Qt.LeftButton | Qt.RightButton
        onClicked: mouse => {
            if (mouse.button === Qt.RightButton) root.closeRequested()
            else root.cardClicked()
        }
    }
    Rectangle {
        id: tile
        x: 18; y: 18; width: 46; height: 46; radius: 6
        color: root.tileColor
        Image {
            anchors.centerIn: parent
            width: 27; height: 27
            source: Qt.resolvedUrl("icons/" + root.tileSymbol + ".svg")
            fillMode: Image.PreserveAspectFit
            visible: root.glyph.length === 0
        }
        Image {
            anchors.centerIn: parent
            width: 27; height: 27
            source: root.semanticIcon ? "" : root.mediaSource
            fillMode: Image.PreserveAspectFit
            asynchronous: true
            visible: !root.semanticIcon && root.glyph.length === 0 && status === Image.Ready
        }
        Text {
            anchors.centerIn: parent
            visible: root.glyph.length > 0
            text: root.glyph
            color: @@color:background@@
            font.family: root.fontFamily
            font.pixelSize: 27
        }
    }
    ColumnLayout {
        id: content
        x: 80; y: 14
        width: parent.width - x - 42
        spacing: 6
        Text {
            Layout.fillWidth: true
            text: root.summary
            textFormat: Text.PlainText
            color: root.effectiveKind === "error" ? root.errorText
                : root.effectiveKind === "download" ? root.accent : @@color:shell.notifications.text@@
            font.family: root.interfaceFamily
            font.pixelSize: 16
            font.bold: true
            wrapMode: Text.Wrap
            maximumLineCount: 2
            elide: Text.ElideRight
        }
        Text {
            Layout.fillWidth: true
            visible: root.body.length > 0
            text: NotificationLogic.sanitizeBody(root.body, root.app, root.appIcon).replace(/\r\n|\r|\n/g, "<br/>")
            textFormat: Text.StyledText
            color: @@color:shell.notifications.text@@
            font.family: root.interfaceFamily
            font.pixelSize: 15
            wrapMode: Text.Wrap
            maximumLineCount: 5
            elide: Text.ElideRight
        }
        Text {
            Layout.fillWidth: true
            visible: root.actionLabel.length > 0
            text: root.actionLabel
            textFormat: Text.PlainText
            color: root.accent
            font.family: root.interfaceFamily
            font.pixelSize: 14
            font.underline: true
            wrapMode: Text.Wrap
            activeFocusOnTab: true
            Accessible.role: Accessible.Button
            Accessible.name: root.actionLabel
            Accessible.onPressAction: root.cardClicked()
            Keys.onReturnPressed: root.cardClicked()
            Keys.onSpacePressed: root.cardClicked()
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: root.cardClicked()
            }
        }
    }
    Item {
        x: parent.width - 38; y: 6; width: 32; height: 32
        activeFocusOnTab: true
        Accessible.role: Accessible.Button
        Accessible.name: "Dismiss notification"
        Accessible.onPressAction: root.closeRequested()
        Keys.onReturnPressed: root.closeRequested()
        Keys.onSpacePressed: root.closeRequested()
        Text {
            anchors.centerIn: parent
            text: "×"
            color: root.accent
            font.family: root.interfaceFamily
            font.pixelSize: 23
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: root.closeRequested()
        }
    }
}

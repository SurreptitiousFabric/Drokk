import QtQuick
import Quickshell
import Quickshell.Wayland

Item {
    id: root
    property var shell: null
    property var manifest: null
    property string omarchyPath: ""
    property bool opened: false

    function open(payloadJson) {
        root.opened = true
        Qt.callLater(function() { card.open() })
    }
    function close() { root.opened = false }

    PanelWindow {
        visible: root.opened
        anchors { top: true; bottom: true; left: true; right: true }
        color: "transparent"
        exclusionMode: ExclusionMode.Ignore
        WlrLayershell.namespace: "megacity-launcher"
        WlrLayershell.layer: WlrLayer.Overlay
        WlrLayershell.keyboardFocus: root.opened ? WlrKeyboardFocus.Exclusive : WlrKeyboardFocus.None

        Rectangle {
            anchors.fill: parent
            color: @@color:shell.menu.scrim@@
            opacity: @@alpha:shell.menu.scrim-alpha@@
        }
        MouseArea { anchors.fill: parent; onClicked: root.close() }
        LauncherCard {
            id: card
            anchors.centerIn: parent
            width: Math.min(implicitWidth, parent.width - 20)
            height: Math.min(implicitHeight, parent.height - 20)
            appLibrary: root.shell ? root.shell.appLibrary : null
            onCloseRequested: root.close()
            onSettingsRequested: {
                root.close()
                Quickshell.execDetached(["omarchy", "menu", "summon", "root"])
            }
        }
    }
}

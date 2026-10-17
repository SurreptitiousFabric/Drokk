import QtQuick
import QtQuick.Effects
import qs.Commons as Commons
import qs.Ui

BarWidget {
    id: root
    moduleName: "megacity.menu"
    implicitWidth: button.implicitWidth
    implicitHeight: button.implicitHeight

    BarIconButton {
        id: button
        anchors.fill: parent
        bar: root.bar
        tooltipText: "Omarchy menu"
        iconComponent: Component {
            Item {
                Image {
                    id: eagle
                    anchors.fill: parent
                    source: "emblem.svg"
                    fillMode: Image.PreserveAspectFit
                    visible: false
                    sourceSize.width: width * Screen.devicePixelRatio
                    sourceSize.height: height * Screen.devicePixelRatio
                }
                MultiEffect {
                    anchors.fill: parent
                    source: eagle
                    colorization: 1
                    colorizationColor: Commons.Color.accent
                }
            }
        }
        onPressed: function(mouseButton) {
            if (!root.bar) return
            if (mouseButton === Qt.RightButton) root.bar.run("xdg-terminal-exec")
            else root.bar.run("omarchy-shell shell toggle omarchy.menu '{\"menu\":\"root\"}'")
        }
    }
}

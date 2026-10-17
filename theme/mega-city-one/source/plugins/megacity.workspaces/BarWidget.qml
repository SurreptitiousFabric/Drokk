import QtQuick
import QtQuick.Layouts
import Quickshell.Hyprland
import qs.Commons
import qs.Ui

BarWidget {
    id: root
    moduleName: "megacity.workspaces"
    function workspaceById(id) {
        var values = Hyprland.workspaces.values
        for (var i=0; i<values.length; i++) if (values[i].id === id) return values[i]
        return null
    }
    function workspaceIds() {
        var ids = [1,2,3,4], values=Hyprland.workspaces.values
        for (var i=0;i<values.length;i++) if(values[i].id>0 && ids.indexOf(values[i].id)<0) ids.push(values[i].id)
        return ids.sort(function(a,b){return a-b})
    }
    implicitWidth: grid.implicitWidth
    implicitHeight: grid.implicitHeight
    GridLayout {
        id: grid; anchors.fill: parent
        columns: root.vertical ? 1 : root.workspaceIds().length
        rowSpacing: 0; columnSpacing: 0
        Repeater {
            model: root.workspaceIds()
            WidgetButton {
                required property int modelData
                readonly property var workspace: root.workspaceById(modelData)
                readonly property bool focused: Hyprland.focusedWorkspace !== null && Hyprland.focusedWorkspace.id === modelData
                readonly property bool urgentWorkspace: workspace !== null && workspace.urgent
                bar: root.bar
                text: String(modelData === 10 ? 0 : modelData)
                foreground: focused ? Color.background : Color.foreground
                fixedWidth: root.vertical ? root.barSize : 34
                fixedHeight: root.barSize
                horizontalMargin: 0; verticalPadding: 0
                tooltipText: "Workspace " + modelData
                onPressed: function() { if(root.bar) root.bar.run("hyprctl dispatch " + Util.shellQuote("hl.dsp.focus({ workspace = \"" + modelData + "\" })")) }
                Rectangle { anchors.centerIn: parent; width: 26; height: 20; radius: 2; color: focused ? Color.accent : "transparent"; z: -1 }
                Rectangle { x: parent.width-7; y: 2; width: 4; height: 4; radius: 2; color: Color.urgent; visible: urgentWorkspace && !focused }
            }
        }
    }
}

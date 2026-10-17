import QtQuick
import Quickshell
ShellRoot {
  id: root
  property var guarded: null
  Component.onCompleted: {
    var component=Qt.createComponent(Quickshell.env("MEGACITY_GUARD_URL"))
    if(component.status !== Component.Ready) { console.error(component.errorString()); Qt.quit(); return }
    guarded=component.createObject(root)
    guarded.omarchyPath=Quickshell.env("MEGACITY_GUARD_HOST")
  }
  Timer {
    interval: 20; running: true; repeat: true
    onTriggered: {
      if (!root.guarded || !root.guarded.children[0].item) return
      var actual=root.guarded.children[0].item.objectName
      if(actual === Quickshell.env("MEGACITY_EXPECTED_SERVICE")) console.log("COMPATIBILITY_LOADER_PASS")
      else console.error("Wrong service selected: " + actual)
      Qt.quit()
    }
  }
  Timer { interval: 4000; running: true; onTriggered: { console.error("Compatibility loader timed out"); Qt.quit() } }
}

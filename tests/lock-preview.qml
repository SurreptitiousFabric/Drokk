import QtQuick
import Quickshell
ShellRoot {
  FloatingWindow {
    id: window
    visible: true; implicitWidth: 1280; implicitHeight: 720
    title: "Mega-City One lock presentation preview — no authentication"
    LockView {
      id: view; anchors.fill: parent
      backgroundPath: Quickshell.env("MEGACITY_PREVIEW_BACKGROUND")
      inputEnabled: true
      property int submissions: 0
      onPasswordTextEdited: function(value) { passwordText = value }
      onSubmitPassword: function(value) { if (value.length > 0) submissions++ }
    }
    Timer {
      interval: 1800; running: true
      onTriggered: {
        var button = null
        function find(item) {
          if (item.objectName === "unlockButton") return item
          for (var i=0;i<item.children.length;i++) { var found=find(item.children[i]); if(found)return found }
          return null
        }
        button = find(view)
        if (!button) { console.error("LOCK_CHECK_FAILED missing button"); Qt.quit(); return }
        view.passwordText = "fixture-input"
        button.submit()
        if (view.submissions !== 1 || view.passwordText !== "") { console.error("LOCK_CHECK_FAILED submit/clear"); Qt.quit(); return }
        view.inputEnabled = false; view.passwordText = "fixture-input"; button.submit()
        if (view.submissions !== 1) { console.error("LOCK_CHECK_FAILED disabled submit"); Qt.quit(); return }
        view.passwordText = ""; view.inputEnabled = true
        console.log("LOCK_VIEW_CHECK_PASS submit/clear and disabled guard; no PAM loaded")
        view.grabToImage(function(result) { result.saveToFile(Quickshell.env("MEGACITY_PREVIEW_CAPTURE")); Qt.quit() })
      }
    }
    Timer { interval: 6000; running: true; onTriggered: Qt.quit() }
  }
}

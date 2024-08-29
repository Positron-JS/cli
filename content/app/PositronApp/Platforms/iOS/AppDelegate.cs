using Foundation;
using NativeShell.Platforms;

namespace PositronApp;

[Register("AppDelegate")]
public class AppDelegate : NativeShellAppDelegate
{
	protected override MauiApp CreateMauiApp() => MauiProgram.CreateMauiApp();

    protected override void OnShowEmptyRemoteNotification()
    {
        
    }

    protected override void TrackError(Exception ex)
    {
        System.Diagnostics.Debug.WriteLine(ex.ToString());
    }
}

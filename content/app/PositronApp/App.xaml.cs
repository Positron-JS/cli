using Positron.Pages;
using Microsoft.Extensions.Configuration;

namespace PositronApp;

public partial class App : Application
{
	public App(IConfiguration config)
	{
		InitializeComponent();

		var url = config.GetSection("App")?.GetValue<string>("Url");

		var deviceType = "Desktop";
		if (DeviceInfo.Idiom == DeviceIdiom.Phone)
		{
			deviceType = "Mobile";
		}
		if (DeviceInfo.Idiom == DeviceIdiom.Tablet)
		{
			deviceType = "Tablet";
		}

		var mainPage = new PositronMainPage()
		{
			Url = url
		};

		var webView = mainPage.WebView;

		if (DeviceInfo.Platform == DevicePlatform.iOS)
		{
			webView.UserAgent = $"Mobile-App/1.0 (iPhone; iOS {DeviceInfo.VersionString}; {deviceType}) XamarinApp/{AppInfo.VersionString} MauiApp/{AppInfo.VersionString}";
		}
		if (DeviceInfo.Platform == DevicePlatform.Android)
		{
			webView.UserAgent = $"Mobile-App/1.0 (Android; {deviceType}) XamarinApp/{AppInfo.VersionString} MauiApp/{AppInfo.VersionString}";
		}

		MainPage = mainPage;
 	}
}

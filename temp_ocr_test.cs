using System;
using System.Threading.Tasks;
using Windows.Storage;
public static class Program {
  public static void Main(string[] args) {
    Console.WriteLine(Go(args[0]).GetAwaiter().GetResult());
  }
  static async Task<string> Go(string path) {
    var file = await StorageFile.GetFileFromPathAsync(path);
    return file.Name;
  }
}

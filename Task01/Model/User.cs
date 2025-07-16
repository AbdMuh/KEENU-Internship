using System.Text.Json.Serialization;

namespace Task01.Model;

public class User
{
    public int  Id { get; set; }
    public required string  Name { get; set; }
    public required string Email { get; set; }

    public required LoginUser loginUser { get; set; } 
    //navigation property, attaches the loginUser object to user object, wherever not null

   
}

using System.Text.Json.Serialization;

namespace Task01.Model;

public class User
{
    public int  Id { get; set; }
    public required string  Name { get; set; }
    public required string Email { get; set; }

    public required LoginUser loginUser { get; set; } //one-to-one navigation property, every user has one loginUser must 

    [JsonIgnore] //Ignore or exclude Usercards From Requests and Responses
    public List<UserCard> UserCards { get; set; } = new(); //many-to-one navigaton property



}

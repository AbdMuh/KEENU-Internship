using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Task01.Migrations
{
    /// <inheritdoc />
    public partial class RemoveNameFromUserLogin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "LoginUser");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "LoginUser",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}

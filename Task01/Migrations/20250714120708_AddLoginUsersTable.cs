using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Task01.Migrations
{
    /// <inheritdoc />
    public partial class AddLoginUsersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LoginUser_Users_UserId",
                table: "LoginUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LoginUser",
                table: "LoginUser");

            migrationBuilder.RenameTable(
                name: "LoginUser",
                newName: "LoginUsers");

            migrationBuilder.RenameIndex(
                name: "IX_LoginUser_UserId",
                table: "LoginUsers",
                newName: "IX_LoginUsers_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LoginUsers",
                table: "LoginUsers",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LoginUsers_Users_UserId",
                table: "LoginUsers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LoginUsers_Users_UserId",
                table: "LoginUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LoginUsers",
                table: "LoginUsers");

            migrationBuilder.RenameTable(
                name: "LoginUsers",
                newName: "LoginUser");

            migrationBuilder.RenameIndex(
                name: "IX_LoginUsers_UserId",
                table: "LoginUser",
                newName: "IX_LoginUser_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LoginUser",
                table: "LoginUser",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LoginUser_Users_UserId",
                table: "LoginUser",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

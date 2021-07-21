public class SQL_injection {
    public static void main(String[] args)

    String input = args[0];

    // the following two lines can be updated to prevent a SQL injection
    PreparedStatement statement = connection.prepareStatement("SELECT * FROM products WHERE category = ?");
    statement.setString(1, input)

    ResultSet resultSet = statement.executeQuery();

}
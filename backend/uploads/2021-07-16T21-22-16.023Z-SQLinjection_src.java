/*
    Current errors: 1
 */
public class SQL_injection {
    public static void main(String[] args)

        String input = args[0];

        // the following two lines can be updated to prevent a SQL injection
        String query = "SELECT * FROM products WHERE category  = '" + input + "'";
        Statement statement =  connection.createStatement();

        ResultSet resultSet = statement.executeQuery(query);

}
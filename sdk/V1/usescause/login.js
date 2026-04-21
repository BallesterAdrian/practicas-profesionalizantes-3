export function login( input )
{
    const userdata =
    {
        username: 'admin',
        password: '1234'
    };

    let output =
    {
        status: false,
        result: null,
        description: 'INVALID_USER_PASS'
    };

    
    if ( input.username === userdata.username && input.password === userdata.password )
    {
        output.status = true;
        output.result = input.username;
        output.description = null;
    }

    return output;
}